# flaskモジュールからFlaskクラスをインポート
from flask import Flask, render_template, request, redirect, session, url_for

# sqlite3をインポート
import sqlite3

# 課題4
from datetime import datetime

import os

# Flaskクラスをインスタンス化してapp変数に代入
app = Flask(__name__)

# secret_keyでセッション情報を暗号化
app.secret_key = "SUNABACO2023"


# ==============================
# トップページ
# ==============================
@app.route("/")
def index():
    return render_template("index.html")

# ==============================
# 実行処理用
# ==============================
if __name__ == "__main__":
    # Run the development server
    app.run(host="0.0.0.0", port=8080, debug=True)
