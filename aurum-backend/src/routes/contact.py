from flask import Blueprint, request, jsonify

contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "Todos os campos são obrigatórios."}), 400

    return jsonify({"message": "Mensagem recebida com sucesso!"}), 200
