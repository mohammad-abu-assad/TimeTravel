from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e): return jsonify(error="bad_request", message=str(e)), 400
    @app.errorhandler(404)
    def not_found(e): return jsonify(error="not_found"), 404
    @app.errorhandler(413)
    def too_large(e): return jsonify(error="payload_too_large"), 413
    @app.errorhandler(Exception)
    def server_error(e):
        app.logger.exception(e)
        return jsonify(error="server_error"), 500
