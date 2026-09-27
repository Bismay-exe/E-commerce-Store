import { FormEvent, useEffect, useState } from "react";
import { request, setToken } from "./api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

const empty = { name: "", description: "", price: "", stock: "", imageUrl: "" };

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Product | null>(null);

  const loadProducts = () =>
    request("/products")
      .then((d) => setProducts(d.products))
      .catch((e) => setMessage(e.message));

  useEffect(() => {
    loadProducts();

    if (localStorage.getItem("accessToken"))
      request("/auth/me")
        .then((d) => setUser(d.user))
        .catch(() => setToken(null));
  }, []);

  const auth = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const values = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const d = await request(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (authMode === "login") {
        setToken(d.accessToken);
        setUser(d.user);
      } else {
        setAuthMode("login");
      }

      setMessage(d.message);
      e.currentTarget.reset();

    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const saveProduct = async (e: FormEvent) => {

    e.preventDefault();

    try {
      const method = editing ? "PUT" : "POST";
      await request(editing ? `/products/${editing._id}` : "/products", {
        method,
        body: JSON.stringify(form),
      });

      setForm(empty);
      setEditing(null);
      setMessage("Product saved.");
      loadProducts();

    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const remove = async (id: string) => {

    if (!confirm("Delete this product?")) return;

    try {
      await request(`/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (err) {
      setMessage((err as Error).message);
    }

  };

  const logout = async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-5 md:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            E-commerce Shop
          </p>
          <h1 className="text-3xl font-bold">Product dashboard</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">Hi, {user.name}</span>
            <button className="secondary" onClick={logout}>
              Log out
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-500">
            Sign in to manage inventory
          </span>
        )}
      </header>
      {message && (
        <p className="mb-5 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
          {message}
        </p>
      )}
      <section className="grid gap-7 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-2xl bg-white p-6 shadow-sm">
          {user ? (
            <>
              <h2 className="mb-4 text-xl font-bold">
                {editing ? "Edit product" : "Add product"}
              </h2>
              <form className="space-y-3" onSubmit={saveProduct}>
                {Object.entries(form).map(([key, value]) => (
                  <label key={key} className="block text-sm capitalize">
                    {key === "imageUrl" ? "Image URL (optional)" : key}
                    <input
                      required={key !== "imageUrl"}
                      type={
                        key === "price" || key === "stock" ? "number" : "text"
                      }
                      min={key === "price" || key === "stock" ? "0" : undefined}
                      value={value}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <button className="primary w-full">
                  {editing ? "Update product" : "Create product"}
                </button>
                {editing && (
                  <button
                    type="button"
                    className="secondary ml-2"
                    onClick={() => {
                      setEditing(null);
                      setForm(empty);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </>
          ) : (
            <>
              <div className="mb-4 flex gap-2">
                <button
                  className={authMode === "login" ? "primary" : "secondary"}
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </button>
                <button
                  className={authMode === "register" ? "primary" : "secondary"}
                  onClick={() => setAuthMode("register")}
                >
                  Register
                </button>
              </div>
              <form className="space-y-3" onSubmit={auth}>
                {authMode === "register" && (
                  <input name="name" placeholder="Your name" required />
                )}
                <input name="email" type="email" placeholder="Email" required />
                <input
                  name="password"
                  type="password"
                  placeholder="Password (8+ characters)"
                  required
                />
                {authMode === "register" && (
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                  />
                )}
                <button className="primary w-full">
                  {authMode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>
            </>
          )}
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">All products</h2>
            <span className="text-sm text-slate-500">
              {products.length} items
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <article
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
                key={p._id}
              >
                {p.imageUrl && (
                  <img
                    className="h-36 w-full object-cover"
                    src={p.imageUrl}
                    alt=""
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{p.description}</p>
                  <div className="mt-4 flex justify-between">
                    <b>${Number(p.price).toFixed(2)}</b>
                    <span className="text-sm">{p.stock} in stock</span>
                  </div>
                  {user && (
                    <div className="mt-4 flex gap-2">
                      <button
                        className="secondary text-sm"
                        onClick={() => {
                          setEditing(p);
                          setForm({
                            name: p.name,
                            description: p.description,
                            price: String(p.price),
                            stock: String(p.stock),
                            imageUrl: p.imageUrl || "",
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-rose-50 text-sm text-rose-700"
                        onClick={() => remove(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!products.length && (
            <p className="rounded-xl border border-dashed p-8 text-center text-slate-500">
              No products yet.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
