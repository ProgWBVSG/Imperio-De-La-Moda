"use client";

export default function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543515555123";
  const defaultMessage = "Hola Imperio de la Moda! Vengo de la página web y me gustaría hacer una consulta.";
  
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-whatsapp text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-whatsapp focus:ring-opacity-50"
      aria-label="Contactanos por WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.096-1.332-.116-.399-.129-1.071-.352-2.05-1.127-1.106-.878-1.722-2.087-1.917-2.359-.14-.195-.477-.6-.477-1.163 0-.583.273-.892.4-.103.11-.122.258-.142.35-.142.11 0 .204.004.298.006.115.006.27-.044.423.324.156.377.534 1.304.58 1.402.046.096.082.203.013.344-.069.143-.106.23-.21.353-.105.123-.224.272-.319.349-.107.086-.22.18-.101.385.118.204.526.87 1.134 1.41.785.698 1.439.914 1.644.914.205 0 .324.088.441-.044.116-.134.502-.584.636-.786.134-.202.268-.168.455-.098.188.07.118-.616 1.391-.685.187-.07.31-.105.356-.142.045-.038.045-.195-.098-.6z" />
        <path fillRule="evenodd" d="M12 2C6.486 2 2 6.486 2 12c0 1.846.505 3.568 1.378 5.068L2 22l4.944-1.373C8.428 21.493 10.147 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18.232c-1.583 0-3.08-.415-4.403-1.16l-.316-.178-2.91.808.823-2.836-.195-.31c-.8-1.272-1.231-2.738-1.231-4.324 0-4.542 3.696-8.239 8.232-8.239 4.542 0 8.238 3.697 8.238 8.239 0 4.542-3.696 8.239-8.238 8.239z" clipRule="evenodd" />
      </svg>
    </a>
  );
}
