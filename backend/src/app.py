from flask import Flask, json, request, session, make_response, jsonify, Response, render_template, send_file
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
from fpdf import FPDF
import re
import bcrypt
from datetime import datetime
from werkzeug.utils import secure_filename
import io
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import random


app = Flask(__name__)
app.secret_key = 'Linda'

# Configuracion Base de Datos
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'cutdb'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['port'] = "3307"

api_cors_config = {
    "origins": "*",
    "allow_headers": "*"
}

CORS(app, supports_credentials=True, resources={
    r"/*": api_cors_config
})

# arrancar Mysql
mysql = MySQL(app)

# Login
@app.route('/', methods=['POST'])
def login():
    d = 'Credenciales Incorrectas'
    c = 'Usuario Denegado'
    if request.method == 'POST':
        email = request.json['correo']
        password = request.json['contraseña'].encode('utf-8')
        Status = "Aceptado"

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        correo = cursor.fetchone()

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE Status = %s AND email = %s', (Status,email))
        Status = cursor.fetchone()

        if correo is None:
            return make_response(jsonify(d), 401)
        
         

        hashed = str(correo['password']).encode('utf-8')
        estatus = bcrypt.checkpw(password, hashed)

        if correo and estatus:
            if Status:
                session.clear()
                session['loggedin'] = True
                session['id'] = correo['codeUDG']
                session['email'] = correo['email']
                session['Rol'] = correo['role']
            else:
                return make_response(jsonify(c), 401)
                
        else:
            return make_response(jsonify(d), 401)

    return make_response(jsonify(session), 200)

@app.route('/recovery_Pass', methods=['POST'])
def recovery_Password():
    
    m='Correo no encontrado'
    if request.method == 'POST':
        email = request.json['email']

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT email FROM users WHERE email = %s', (email,))
        Ema = cursor.fetchone()
        e = ""
        if Ema is None:
            return make_response(jsonify(m), 401)
        else : e = Ema['email']
    token = random.randint(1000, 9000)
    tok = str(token)
    msg = MIMEMultipart()
    message = "Este es tu token de verificacion, usalo para actualizar tu contraseña: "+tok
    password = "cutonala123"
    cursor.execute('UPDATE users SET password = %s WHERE email = %s',(tok,e)) 
    mysql.connection.commit()
    msg['From'] = "cutonalaevidencias@gmail.com"
    msg['To'] = e
    msg['Subject'] = "Recuperacion de contraseña"
    msg.attach(MIMEText(message, 'plain'))
    server = smtplib.SMTP('smtp.gmail.com: 587')
    server.starttls()
    server.login(msg['From'], password)
    server.sendmail(msg['From'], msg['To'], msg.as_string())
    server.quit()
    return make_response(jsonify("Correo Enviado"), 200)


@app.route('/changePs', methods=['post'])
def ChangeP():

    m='El correo y token no coinciden'
    email = request.json['email']
    if request.method == 'POST':
        email = request.json['email']
        contraseña = request.json['contraseña']
        token = request.json['token']
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT email FROM users WHERE password = %s and email = %s', (token,email))
        Ema = cursor.fetchone()
        e = ""
        if Ema is None:
            return make_response(jsonify(m), 401)
        else :
            cursor.execute('UPDATE users SET password = %s WHERE email = %s', (bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt()),email))
            mysql.connection.commit()
            return  make_response(jsonify("Contraseña Actualizada"), 200)


@app.route('/logout', methods=['GET'])
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('email', None)
    session.pop('Rol', None)

    return make_response(jsonify(session))



      



@app.route('/register', methods=['POST'])
def register():
    a = 'Registro exitoso!'
    b = 'Codigo ya Registrado.'
    c = 'Correo ya Registrado.'
    d = 'Correo invalido intenta de nuevo.'
    e = 'Codigo invalido solo debe tener numeros.'
    f = 'Escoge un Rol'

    if request.method == 'POST':
        code = request.json['codigo']
        name = request.json['nombre']
        email = request.json['email']
        password = request.json['contraseña']
        role = request.json['role']
        Status = request.json['status']


        # validacion en db sobre codigo
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE codeUDG = %s', (code,))
        codigo = cursor.fetchall()
        # validacion en db sobre correo
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        correo = cursor.fetchall()

        if codigo:
            return make_response(jsonify(b), 400)
        elif correo:
            return make_response(jsonify(c), 400)
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return make_response(jsonify(d), 400)
        elif not re.match(r'^[0-9,$]+$', code):
            return make_response(jsonify(e), 400)
        elif not re.match(r'^["1"|"2"|"3"|"4"|"5"|"6"]+$', json.dumps(role)):
            return make_response(jsonify(f), 400)
        else:
            cursor.execute('INSERT INTO users VALUES (%s,%s,%s,%s,%s,%s)', (code, name,
                           email, bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()), role, Status))
            mysql.connection.commit()

    return make_response(jsonify(a), 200)


# Perfil, About , Forgot Pass
@app.route('/profile', methods=['POST'])
def profile():
    if request.method == 'POST':
        code = request.json['codigo']

        # fetch
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT `users`.`codeUDG`, `users`.`fullName`, `users`.`email`, `users`.`role`, `users`.`Status` FROM `users` WHERE codeUDG = %s', (code,))
        res = cursor.fetchone()

        return make_response(jsonify(res), 200)

@app.route('/validar', methods=['POST'])
def validar():
    a = "Usuario validado con exito"
    b = "Error al actualizar"
    if request.method == 'POST':
        code = request.json['codigo']
        status = request.json['status']
        if status == "Aceptado": 
            cursor = mysql.connection.cursor()
            cursor.execute('UPDATE `users` SET `Status`= %s WHERE codeUDG = %s',(status,code))
            res = cursor.fetchone()
            return make_response(jsonify(a), 200)
        else:
            return make_response(jsonify(b), 200)


@app.route('/novalidar', methods=['POST'])
def novalidar():
    a = "Usuario no validado con exito"
    b = "Error al actualizar"
    if request.method == 'POST':
        code = request.json['codigo']
        status = request.json['status']
        if status == "Denegado": 
            cursor = mysql.connection.cursor()
            cursor.execute('UPDATE `users` SET `Status`= %s WHERE codeUDG = %s',(status,code))
            res = cursor.fetchone()
            return make_response(jsonify(a), 200)
        else:
            return make_response(jsonify(b), 200)               



# Componente Uploads (React)
@app.route('/uploads', methods=['POST', 'GET'])
@cross_origin()
def uploads():
    b = 'Fallo al subir archivo limpie el formulario e intente de nuevo.'
    c = 'Metodo no permitido'

    if request.method == 'POST':
        if request.files:
            # Nuevas variables
            idTeachers = session['id']
            academyName = request.form['academyName']
            courseName = request.form['courseName']
            evidenceType = request.form['evidenceType']
            shift = request.form['shift']
            date = datetime.now()
            cycle = request.form['cycle']

            files = request.files.getlist('formFile')
            myList = []

            for i in files:
                filedata = i.read().decode('latin-1')
                filename = secure_filename(i.filename)
                filename = filename.replace('_',' ')
                mimetype = i.mimetype
                myList.append(filename)

                cursor = mysql.connection.cursor()
                cursor.execute('INSERT INTO files VALUES (%s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', (
                    'Null', date, cycle, idTeachers, academyName, courseName, evidenceType, shift, filename, filedata.encode('latin-1'), mimetype))
                mysql.connection.commit()
            return make_response(render_template('uploadDone.html', msg=myList), 200)

        else:
            return make_response(b, 400)
    else:
        return make_response(jsonify(c), 400)

@app.route('/academy', methods=['GET'])
def academy():
    a = 'Algo salio mal'
    if request.method == 'GET':
        # Request en la db de academy
        acad = mysql.connection.cursor()
        acad.execute('SELECT * FROM academy')
        academy = acad.fetchall()

        return make_response(jsonify(academy), 200)
    else:
        return make_response(jsonify(a), 400)

@app.route('/course', methods=['POST'])
def course():
    a = 'Algo salio mal'
    academia = request.json['academia']

    if request.method == 'POST':
        cour = mysql.connection.cursor()
        cour.execute(
            'SELECT NameCourse FROM course WHERE idAcademy= %s', (academia,))
        courses = cour.fetchall()
        return make_response(jsonify(courses), 200)
    else:
        return make_response(jsonify(a), 400)


# Componente Report(React)
@app.route('/download/report/pdf', methods=['POST'])
def download_report():
    a = 'Codigo no encontrado'
    # MySQL files
    code = request.json['Codigo']
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM files WHERE idTeachers = %s', (code,))
    result = cursor.fetchall()

    # Validacion Leo
    code = request.json['Codigo']
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM users WHERE codeUDG = %s', (code,))
    res = cur.fetchone()

    if res:
        # Formato de pagina
        pdf = FPDF(orientation='L', unit='mm', format='A4')
        pdf.add_page()

        # Informacion del encabezado
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_text_color(255)
        pdf.cell(w=40, h=15, txt='Codigo UDG', border=1, align='C', fill=True)
        pdf.set_text_color(0)
        pdf.multi_cell(w=120, h=15, txt=str(
            res['codeUDG']), border=1, align='C', fill=0)
        pdf.set_text_color(255)
        pdf.cell(w=40, h=15, txt='Nombre', border=1, align='C', fill=True)
        pdf.set_text_color(0)
        pdf.multi_cell(w=120, h=15, txt=str(
            res['fullName']), border=1, align='C', fill=0)
        pdf.set_text_color(255)
        pdf.cell(w=40, h=15, txt='Correo', border=1, align='C', fill=True)
        pdf.set_text_color(0)
        pdf.multi_cell(w=120, h=15, txt=str(
            res['email']), border=1, align='C', fill=0)

        # Imagen
        pdf.image('./images/cut.png', 210, 7, 50, 50)

        # Titulo tabla
        pdf.ln(10)
        pdf.set_fill_color(29, 29, 29)
        pdf.set_text_color(255)
        pdf.cell(w=0, h=10, txt="Reporte de Actividades",
                 border=1, ln=1, align='C', fill=True)

        # Tabla datos
        pdf.set_fill_color(50, 50, 50)
        pdf.set_text_color(255)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(w=10, h=8, txt='#', border=1, align='C', fill=True)
        pdf.cell(w=40, h=8, txt='Id Maestro', border=1, align='C', fill=True)
        pdf.cell(w=20, h=8, txt='Fecha', border=1, align='C', fill=True)
        pdf.cell(w=60, h=8, txt='Tipo de reporte',
                 border=1, align='C', fill=True)
        pdf.multi_cell(w=0, h=8, txt='Nombre Archivo',
                       border=1, align='C', fill=True)

        # Insertar datos a la tabla
        for row in result:
            pdf.set_font('Helvetica', '', 9)
            pdf.set_text_color(0)
            pdf.cell(w=10, h=7, txt=str(
                row['id']), border=1, align='C', fill=0)
            pdf.cell(w=40, h=7, txt=str(
                row['idTeachers']), border=1, align='C', fill=0)
            pdf.cell(w=20, h=7, txt=str(
                row['date']), border=1, align='C', fill=0)
            pdf.cell(w=60, h=7, txt=str(
                row['evidenceType']), border=1, align='C', fill=0)
            pdf.multi_cell(
                w=0, h=7, txt=row['fileName'], border=1, align='C', fill=0)
        # Creacion de PDF
        return Response(pdf.output(dest='S').encode('latin-1'), mimetype='application/pdf', headers={'Content-Disposition': 'attachment;filename=Reporte.pdf'})
    else:
        return make_response(jsonify(a), 401)

@app.route('/getfiles', methods=['POST'])
def getTeacher():
     if request.method == 'POST':
        code = request.json['codigo']
        cycle = request.json['cycleSelect']
        cursor = mysql.connection.cursor()
        if not cycle:
            cursor.execute('SELECT files.date, files.cycle, files.id, files.idTeachers, files.courseName, files.evidenceType, files.shift, files.fileName FROM files WHERE idTeachers = %s', (code,))
        else:
            cursor.execute('SELECT fi.date, fi.id, fi.idTeachers, fi.courseName, fi.evidenceType, fi.shift, fi.fileName' +
                            ' FROM files fi inner join cycles cy on fi.cycle = cy.id WHERE idTeachers = %s and cy.id = %s', (code, cycle))  
        res = cursor.fetchall()
        return make_response(jsonify(res), 200)


@ app.route('/getSchoolCycles', methods=['POST'])
def getCycles():
    if request.method == 'POST':
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, cycle FROM cycles')
        cycle = cursor.fetchall()
        return make_response(jsonify(cycle), 200)
        

@ app.route('/addCycle', methods=['POST'])
def addCycle():
    c = 'Metodo no permitido'
    if request.method == 'POST':
        cycle = request.json['cycle']
        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO cycles(`cycle`) VALUES (%s)', (cycle, ))
        mysql.connection.commit()
        return make_response(jsonify("El ciclo " + cycle + " fue agragado"), 200)
    else:
        return make_response(jsonify(c), 400)


@app.route('/plot', methods=['POST'])
def plot():
     if request.method == 'POST':

        code = request.json['codigo']
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT courseName, COUNT(*) AS qty FROM files WHERE idTeachers = %s GROUP BY courseName',(code,))
        res = cursor.fetchall()
        return make_response(jsonify(data = res), 200)

@app.route('/deleteFile/<int:id>', methods=['DELETE'])
def chartDelete(id):

    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM files WHERE id = %s',(id,))
    mysql.connection.commit()
    return jsonify({'msg': 'Archivo Eliminado'})


# Componente Audit(React)
@app.route('/users')
def users():
    d = 'Necesitas iniciar sesion para ver el contenido'
    if 'loggedin' in session:

        users = []
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT users.codeUDG, users.fullName, users.email FROM users WHERE role = 2 ORDER BY users.fullName ASC')
        res = cursor.fetchall()

        for u in res:
            users.append(u)

        return make_response(jsonify(users))

    return make_response(jsonify(d), 401)

@app.route('/userschecking')
def userschecking():
    d = 'Necesitas iniciar sesion para ver el contenido'
    if 'loggedin' in session:

        users = []
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT users.codeUDG, users.fullName, users.email FROM users ORDER BY users.fullName ASC')
        res = cursor.fetchall()

        for u in res:
            users.append(u)

        return make_response(jsonify(users))

    return make_response(jsonify(d), 401)

@app.route('/fileView/<id>', methods=['GET'])
def fileView(id):

    a ='Inicia sesion para ver el contenido.'
    if 'loggedin' in session:

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT files.file, files.mimetype FROM files WHERE id = %s', (id,))
        data = cursor.fetchall()

        file = data[0]['file']
        mime = str(data[0]['mimetype'])
        return Response(io.BytesIO(file), mimetype=mime)
    else: 
        return make_response(a,401)

@app.route('/view/<codigo>', methods=['GET'])
def view(codigo):
    d = 'Necesitas iniciar sesion para ver el contenido'

    if 'loggedin' in session:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT files.id, files.academyName, files.courseName, files.evidenceType, files.shift, files.fileName FROM files WHERE idTeachers = %s', (codigo,))
        res = cursor.fetchall()

        return make_response(jsonify(res))
    return make_response(jsonify(d), 401)

@app.route('/view/', methods=['GET'])
def viewAllFiles():
    d = 'Necesitas iniciar sesion para ver el contenido'

    if 'loggedin' in session:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT files.id, files.academyName, files.courseName, files.evidenceType, files.shift, files.fileName FROM files')
        res = cursor.fetchall()

        return make_response(jsonify(res))
    return make_response(jsonify(d), 401)

@app.route('/quickvalidacion/<codigo>', methods=['GET'])
def quickvalidacion(codigo):
    a = 'Code Undefined'
    if codigo != None:
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT `users`.`codeUDG`, `users`.`fullName`, `users`.`email`, `users`.`role`, `users`.`Status`FROM `users` WHERE codeUDG = %s', (code,))
        res = cursor.fetchone()

        return make_response(jsonify(res), 200)
    else:
        return make_response(jsonify(a), 400)




def definirStatus(codigo):
    a = 'Code Undefined'
    if codigo != None:
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT Status FROM users WHERE codeUDG = %s', (codigo,))
        status = cursor.fetchall()
        return status
    else:
        return make_response(jsonify(a), 400)



        
def quickEvidence(codigo):
    a = 'Code Undefined'
    if codigo != None:
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT date, max(date) AS lastdate FROM files WHERE idTeachers = %s', (codigo,))
        res = cursor.fetchall()
        return res
    else:
        return make_response(jsonify(a), 400)

def quickTotal(codigo):
    a = 'Code Undefined'
    if codigo != None:
        cursor = mysql.connection.cursor()
        cursor.execute(
            'SELECT count(*) as total from files WHERE idTeachers = %s', (codigo,))
        res = cursor.fetchall()
        return res
    else:
        return make_response(jsonify(a), 400)



if __name__ == '__main__':
    app.run(debug=True)
