import os
import sys
import argparse
import json
import uuid
import datetime
from pathlib import Path
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import re
import unicodedata

# ---------------------------------------------------------
# 1. INICIALIZACIÓN
# ---------------------------------------------------------
load_dotenv()

DIRECT_URL = os.environ.get("DIRECT_URL")
if not DIRECT_URL:
    print("ERROR: No se encontró DIRECT_URL en el archivo .env")
    sys.exit(1)

def generar_slug(texto):
    """Convierte un texto en un slug amigable para URLs."""
    texto = str(texto).lower()
    # Quitar tildes
    texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')
    # Reemplazar caracteres no alfanuméricos por guiones
    texto = re.sub(r'[^a-z0-9]+', '-', texto)
    return texto.strip('-')

def clean_json_col(val):
    """Limpia y convierte strings de Excel (ej: 'S, M, L') en listas JSON validas."""
    if pd.isna(val) or str(val).strip() == "":
        return "[]"
    
    val_str = str(val).strip()
    # Si ya parece JSON, intentamos parsearlo
    if val_str.startswith("[") and val_str.endswith("]"):
        try:
            json.loads(val_str)
            return val_str
        except:
            pass
            
    # Si es separado por comas
    items = [item.strip() for item in val_str.split(",") if item.strip()]
    return json.dumps(items)

def clean_stock_json(val):
    """Convierte un string como 'S:5, M:10' a JSON válido y calcula el stock total."""
    if pd.isna(val) or str(val).strip() == "":
        return "{}", 0
        
    val_str = str(val).strip()
    if val_str.startswith("{") and val_str.endswith("}"):
        try:
            d = json.loads(val_str)
            return val_str, sum(int(v) for v in d.values() if str(v).isdigit())
        except:
            pass
            
    # Parsear formato manual S:5, M:10
    stock_dict = {}
    total_stock = 0
    try:
        parts = [p.strip() for p in val_str.split(",") if p.strip()]
        for p in parts:
            if ":" in p:
                k, v = p.split(":", 1)
                k = k.strip()
                v = int(v.strip())
                stock_dict[k] = v
                total_stock += v
    except Exception as e:
        print(f"⚠️ Advertencia: Formato de stock no reconocido ({val_str}). Usando 0.")
        return "{}", 0
        
    return json.dumps(stock_dict), total_stock

# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Importador de Stock desde Excel a Supabase.")
    parser.add_argument("--file", required=True, help="Ruta al archivo Excel (.xlsx)")
    args = parser.parse_args()

    excel_path = Path(args.file)
    if not excel_path.exists():
        print(f"ERROR: El archivo {excel_path} no existe.")
        sys.exit(1)

    print(f"Leyendo archivo: {excel_path}")
    try:
        df = pd.read_excel(excel_path)
    except Exception as e:
        print(f"ERROR al leer el Excel: {e}")
        sys.exit(1)

    # Normalizar columnas
    df.columns = [str(c).strip().lower() for c in df.columns]
    
    # Columnas obligatorias
    required_cols = ['nombre', 'categoria', 'precio_minorista', 'precio_mayorista']
    for col in required_cols:
        if col not in df.columns:
            print(f"ERROR: Falta la columna obligatoria '{col}' en el Excel.")
            sys.exit(1)

    # Filtrar vacíos
    df = df.dropna(subset=['nombre'])
    
    print(f"{len(df)} productos encontrados para procesar.")
    
    productos_a_upsert = []
    
    # Extraer y transformar filas
    for index, row in df.iterrows():
        nombre = str(row['nombre']).strip()
        slug = generar_slug(nombre)
        
        # Opcionales
        descripcion = str(row.get('descripcion', '')) if not pd.isna(row.get('descripcion')) else ""
        codigo_interno = str(row.get('codigo_interno', '')) if not pd.isna(row.get('codigo_interno')) else ""
        
        # JSON fields
        talles = clean_json_col(row.get('talles'))
        colores = clean_json_col(row.get('colores'))
        
        # Stock
        stock_por_talle, stock_calculado = clean_stock_json(row.get('stock_por_talle'))
        stock_manual = row.get('stock', 0)
        stock_total = stock_calculado if stock_calculado > 0 else (int(stock_manual) if not pd.isna(stock_manual) else 0)
        
        # Bools
        oculto = bool(row.get('oculto', False))
        destacado = bool(row.get('destacado', False))
        novedad = bool(row.get('novedad', True))
        
        # UUID
        producto_id = str(uuid.uuid4())
        ahora = datetime.datetime.now()

        # Tupla para psycopg2
        # schema: id, slug, nombre, categoria, precio_mayorista, precio_minorista, descripcion, codigo_interno, talles, colores, stock_por_talle, fotos, stock, oculto, destacado, novedad, creado_en, actualizado_en
        productos_a_upsert.append((
            producto_id,
            slug,
            nombre,
            str(row['categoria']).strip(),
            int(row['precio_mayorista']) if not pd.isna(row['precio_mayorista']) else 0,
            int(row['precio_minorista']) if not pd.isna(row['precio_minorista']) else 0,
            descripcion,
            codigo_interno,
            talles,
            colores,
            stock_por_talle,
            "[]", # fotos se dejan vacías por default si es de Excel, o manejarlo si existe
            stock_total,
            oculto,
            destacado,
            novedad,
            ahora,
            ahora
        ))

    if len(productos_a_upsert) == 0:
        print("No hay productos válidos para sincronizar. Finalizando.")
        sys.exit(0)

    # Conectar a PostgreSQL e Insertar
    print("Conectando a Supabase PostgreSQL...")
    try:
        conn = psycopg2.connect(DIRECT_URL)
        cur = conn.cursor()
        
        query = """
        INSERT INTO "Producto" (
            id, slug, nombre, categoria, precio_mayorista, precio_minorista, 
            descripcion, codigo_interno, talles, colores, stock_por_talle, 
            fotos, stock, oculto, destacado, novedad, creado_en, actualizado_en
        ) VALUES %s
        ON CONFLICT (slug) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            categoria = EXCLUDED.categoria,
            precio_mayorista = EXCLUDED.precio_mayorista,
            precio_minorista = EXCLUDED.precio_minorista,
            descripcion = EXCLUDED.descripcion,
            codigo_interno = EXCLUDED.codigo_interno,
            talles = EXCLUDED.talles,
            colores = EXCLUDED.colores,
            stock_por_talle = EXCLUDED.stock_por_talle,
            stock = EXCLUDED.stock,
            oculto = EXCLUDED.oculto,
            destacado = EXCLUDED.destacado,
            novedad = EXCLUDED.novedad,
            actualizado_en = EXCLUDED.actualizado_en;
        """
        
        print(f"Ejecutando UPSERT de {len(productos_a_upsert)} productos...")
        execute_values(cur, query, productos_a_upsert)
        conn.commit()
        print("¡Sincronización completada con éxito!")
        
        # Escribir log
        Path(".tmp").mkdir(exist_ok=True)
        log_path = Path(".tmp/import_log.json")
        with open(log_path, 'w', encoding='utf-8') as f:
            json.dump({
                "fecha": str(datetime.datetime.now()),
                "productos_procesados": len(productos_a_upsert),
                "estado": "SUCCESS"
            }, f, indent=4)
            
    except Exception as e:
        print(f"ERROR de Base de Datos: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
