import os
import re
import subprocess

def main():
    # 1. Eliminar referencias a "charlas" en nosotros/page.tsx
    page_path = os.path.join("src", "app", "nosotros", "page.tsx")
    
    if os.path.exists(page_path):
        with open(page_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Eliminar las referencias directas en el texto
        new_content = content.replace("herramientas, charlas y asesoramiento", "herramientas y asesoramiento")
        
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Se actualizaron las referencias a charlas en {page_path}")
    else:
        print(f"⚠️ No se encontró {page_path}")
        
    # 2. Add, Commit, Push
    try:
        subprocess.run(["git", "add", "."], check=True)
        print("✅ git add.")
        
        subprocess.run(["git", "commit", "-m", "fix: eliminar referencias, pagina y seccion de charlas"], check=True)
        print("✅ git commit exitoso.")
        
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("✅ git push origin main exitoso.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error durante los comandos de git: {e}")

if __name__ == "__main__":
    main()
