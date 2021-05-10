import { store } from "react-notifications-component";

export const transformName = (name) => {
  return name.replace(/\s+/g, "_");
};
export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export const untransformName = (name) => {
  return name.replace(/_/g, " ");
};
export const extractExtension = (url) => {
  return url.substr(url.lastIndexOf(".") + 1);
};

/** Converts to media type from extension
 *  Supports: jpeg and png
 */
export const mediaTypeFromExtension = (extension) => {
  const type = extension === "png" ? "png" : "jpeg";
  return `image/${type}`;
};

export const throwErrorUponHTTPError = async (res) => {
  if (res.status >= 400 && res.status < 600) {
    let body = "";
    try {
      body = JSON.stringify(await res.json());
    } catch {
      body = await res.text();
    }
    throw new Error(body);
  } else {
    return res;
  }
};

export const notify = (title, message, type) => {
  return store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 3200,
      onScreen: true,
    },
  });
};
export const cartExpired = () => {
  notify("EXPIRED", "Your cart has expired.", "warning");
  console.log("Cart expired");
};
