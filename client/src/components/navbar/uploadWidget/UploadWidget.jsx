import { createContext,useRef, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();
function UploadWidget({ uwConfig, setState }) {
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef(null); // Ref to store the widget instance

  useEffect(() => {
    // Load Cloudinary script if not already loaded
    const scriptId = "cloudinary-upload-widget";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setLoaded(true); // Set loaded state
      document.body.appendChild(script);
    } else {
      setLoaded(true); // Script already loaded
    }

    // Cleanup: Remove widget instance on unmount
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const initializeCloudinaryWidget = () => {
    if (!loaded || widgetRef.current) return; // Avoid duplicate initialization

    // Create and store widget instance
    widgetRef.current = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        if (!error && result.event === "success") {
          console.log("Upload Success: ", result.info.secure_url);
          setState((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  };

  const openWidget = () => {
    if (!widgetRef.current) initializeCloudinaryWidget(); // Initialize if not done
    widgetRef.current.open(); // Open the widget
  };

  return (
    <button
      className="cloudinary-button"
      onClick={openWidget} // Open widget on button click
    >
      Upload
    </button>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };