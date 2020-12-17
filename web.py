from flask import Flask, request, render_template, url_for
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/create_account/')
def create_account():
    return render_template('create_account.html')


@app.route('/menu/')
def menu():
    return render_template('menu.html')


@app.route('/menu/', methods=['POST'])
def menu_POST():
    return render_template('menu.html')


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


if __name__ == '__main__':
    app.run(host="localhost", port=8080)
