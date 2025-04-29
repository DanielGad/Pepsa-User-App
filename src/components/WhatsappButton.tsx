const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/2349054720093"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-6 z-50"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      />
    </a>
  );
};

export default WhatsAppButton;
