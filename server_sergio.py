from flask import Flask, send_from_directory, abort, request
import os
import re

app = Flask(__name__)

# Root del progetto = cartella dove sta questo script
ROOT = os.path.dirname(os.path.abspath(__file__))

def serve_file(rel_path: str):
    """Serve un file relativo alla root del progetto."""
    abs_path = os.path.join(ROOT, rel_path)
    if not os.path.isfile(abs_path):
        abort(404)
    directory = os.path.dirname(abs_path)
    filename = os.path.basename(abs_path)
    return send_from_directory(directory, filename)

@app.after_request
def disable_cache(response):
    # Utile in sviluppo: evita che il browser tenga vecchi CSS/JS
    response.headers["Cache-Control"] = "no-store, max-age=0"
    return response

@app.route("/")
def home():
    return serve_file("index.html")

@app.route("/didattica")
def didattica_pretty():
    return serve_file("didattica.html")

@app.route("/architettura")
def architettura_pretty():
    return serve_file("architettura.html")

@app.route("/menu")
def menu_pretty():
    return serve_file("menu.html")

# /lezione2  -> /lezioni/lezione2.html
@app.route("/lezione<int:n>")
def lezione_pretty(n: int):
    return serve_file(f"lezioni/lezione{n}.html")

# /lezioni/box/lezione2/box-2.3  -> /lezioni/box/lezione2/box-2.3.html
@app.route("/lezioni/box/lezione<int:n>/<boxname>")
def box_pretty(n: int, boxname: str):
    if not boxname.lower().startswith("box-"):
        abort(404)
    # accetta box-2.3 oppure box-2.3.html
    if not boxname.lower().endswith(".html"):
        boxname = boxname + ".html"
    return serve_file(f"lezioni/box/lezione{n}/{boxname}")

# Static: qualunque file/cartoella esistente nella root (css, img, lezioni, pdf, ecc.)
@app.route("/<path:filepath>")
def static_any(filepath: str):
    # Se chiedono un URL senza estensione e esiste un .html corrispondente, riscrivi.
    # Esempio: /didattica -> didattica.html (già gestito sopra), ma qui copri casi extra.
    if "." not in os.path.basename(filepath):
        candidate = filepath + ".html"
        if os.path.isfile(os.path.join(ROOT, candidate)):
            return serve_file(candidate)

    # Altrimenti prova a servire il file così com'è
    if os.path.isfile(os.path.join(ROOT, filepath)):
        return serve_file(filepath)

    abort(404)

if __name__ == "__main__":
    # 0.0.0.0 = accessibile anche da altri device nella LAN (se ti serve test tablet/telefono)
    app.run(host="0.0.0.0", port=8000, debug=True)