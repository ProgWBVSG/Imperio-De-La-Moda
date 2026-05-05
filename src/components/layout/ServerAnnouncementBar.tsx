import prisma from "@/lib/prisma";

export default async function ServerAnnouncementBar() {
  try {
    const record = await prisma.configuracion.findUnique({
      where: { key: "global" }
    });

    let config = {
      anuncio_texto: "🔥 Los mejores precios mayoristas del país",
      mostrar_anuncio: true
    };

    if (record) {
      config = JSON.parse(record.value);
    }

    if (!config.mostrar_anuncio) return null;

    return (
      <div className="bg-accent text-primary font-bold text-center py-2 px-4 text-xs md:text-sm tracking-wide w-full shadow-sm">
        {config.anuncio_texto}
      </div>
    );
  } catch (error) {
    return null;
  }
}
