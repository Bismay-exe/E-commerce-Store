const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = localStorage.getItem("accessToken");


export const setToken = (token: string | null) => {

  accessToken = token;

  token
    ? localStorage.setItem("accessToken", token)
    : localStorage.removeItem("accessToken");
};

export async function request(path: string, options: RequestInit = {}) {

  const response = await fetch(`${API}${path}`, {

    ...options,
    credentials: "include",
    
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },

  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok)

    throw new Error(
      data.errors?.map((e: { message: string }) => e.message).join(" ") ||
        data.message ||
        "Request failed.",
    );

  return data;
}
