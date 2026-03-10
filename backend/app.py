from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import mysql.connector

app = Flask(__name__)
# Esta configuración habilita CORS para TODOs el sitio y TODAS las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

# Función de Base de Datos
def conectar_db():
    return mysql.connector.connect(
        host="nelsonadgo.mysql.pythonanywhere-services.com",  # "localhost",
        user="nelsonadgo",  # "root",
        password="cdodatabase123",   # "",
        database="nelsonadgo$boutiquecdo"  #"boutiquecdo"
    )

# Rutas

@app.route('/')
def inicio():
    return jsonify({"mensaje": "Servidor Python activo 🐍"})

@app.route('/login', methods=['POST'])
def login():
    datos = request.json
    usuario = datos.get('usuario')
    password = datos.get('password')

    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True) 
        
        # Pedimos explícitamente el id, usuario, password, rol y nombre_completo
        cursor.execute("SELECT id, usuario, password, rol, nombre_completo FROM usuarios WHERE usuario = %s AND password = %s", (usuario, password))
        usuario_bd = cursor.fetchone()
        
        cursor.close()
        conexion.close()

        if usuario_bd:
            # Si no tiene nombre_completo, usa el usuario
            nombre_mostrar = usuario_bd['nombre_completo'] if usuario_bd['nombre_completo'] else usuario_bd['usuario']
            
            # El paquete JSON
            return jsonify({
                "status": "ok", 
                "id": usuario_bd['id'],     
                "rol": usuario_bd['rol'],
                "nombre": nombre_mostrar 
            })
        else:
            return jsonify({"status": "error", "mensaje": "Credenciales inválidas"})
            
    except Exception as e:
        print("Error en login:", e)
        return jsonify({"status": "error", "mensaje": str(e)})

@app.route('/registro', methods=['POST'])
def registro():
    datos = request.get_json()
    nombre_completo = datos.get('nombreCompleto')
    dni = datos.get('dni')
    direccion = datos.get('direccion')
    telefono = datos.get('telefono')
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    print(f"Intento de registro: {usuario}")

    try:
        db = conectar_db()
        cursor = db.cursor()
        # Insertamos el usuario
        sql = "INSERT INTO usuarios (nombre_completo, dni, direccion, telefono, usuario, password, rol) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (nombre_completo, dni, direccion, telefono, usuario, password, 'socio'))

        db.commit() # Guardar cambios en la BD        
        cursor.close()
        db.close()
        
        print("¡Usuario guardado en BD!")
        return jsonify({"mensaje": "Registro exitoso", "status": "ok"})
        
    except Exception as e:
        print(f"Error en BD: {e}")
        return jsonify({"mensaje": "Error en el servidor", "status": "error"})
    
# Nueva ruta para obtener la lista de socios
@app.route('/usuarios', methods=['GET'])
def lista_usuarios():
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True) # Importante: dictionary=True para que nos dé los nombres de columna
        
        cursor.execute("SELECT id, usuario FROM usuarios") # NO traemos el password por seguridad
        usuarios = cursor.fetchall() # fetchall() trae TODOS los registros, no solo uno
        
        cursor.close()
        db.close()
        
        return jsonify(usuarios) # Flask convierte la lista de Python a JSON automáticamente
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener usuarios"})
    
# Ruta para obtener el catálogo de productos
@app.route('/productos', methods=['GET'])
def obtener_productos():
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM productos")
        productos = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(productos)
    except Exception as e:
        return jsonify({"mensaje": "Error al cargar productos"})

# Eliminar un usuario por ID
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    try:
        db = conectar_db()
        cursor = db.cursor()
        
        sql = "DELETE FROM usuarios WHERE id = %s"
        cursor.execute(sql, (id,))
        db.commit()
        
        cursor.close()
        db.close()
        
        return jsonify({"mensaje": "Usuario eliminado", "status": "ok"})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al eliminar usuario", "status": "error"})
    
@app.route('/inscribir', methods=['POST'])
def inscribir():
    datos = request.get_json()
    usuario_id = datos.get('usuario_id')
    servicio = datos.get('servicio')
    
    try:
        db = conectar_db()
        cursor = db.cursor()
        # Guardamos la inscripción
        cursor.execute("INSERT INTO inscripciones (usuario_id, servicio) VALUES (%s, %s)", (usuario_id, servicio))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Inscripción exitosa", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})
    
# Ruta para ver las inscripciones de un usuario específico
@app.route('/inscripciones/<int:usuario_id>', methods=['GET'])
def listar_inscripciones(usuario_id):
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True)
        
        # Seleccionamos el nombre del servicio y la fecha
        # WHERE usuario_id = %s es el filtro clave
        cursor.execute("SELECT id, servicio, fecha FROM inscripciones WHERE usuario_id = %s", (usuario_id,))
        inscripciones = cursor.fetchall()
        
        cursor.close()
        db.close()
        
        return jsonify(inscripciones)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener inscripciones"})


# Crear un nuevo servicio
@app.route('/servicios', methods=['POST'])
def crear_servicio():
    datos = request.get_json()
    nombre = datos.get('nombre')
    descripcion = datos.get('descripcion')
    imagen = datos.get('imagen')
    
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO servicios (nombre, descripcion, imagen) VALUES (%s, %s, %s)", (nombre, descripcion, imagen))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Servicio creado", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})

# Eliminar un servicio
@app.route('/servicios/<int:id>', methods=['DELETE'])
def eliminar_servicio(id):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM servicios WHERE id = %s", (id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Servicio eliminado", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})

# Comprar
@app.route('/comprar', methods=['POST'])
def procesar_compra():
    try:
        datos = request.json
        usuario_id = datos.get('usuario_id')
        total = datos.get('total')
        detalles = datos.get('detalles')

        zona_arg = timezone(timedelta(hours=-3))  # Zona horaria de Argentina
        fecha_local = datetime.now(zona_arg).strftime('%Y-%m-%d %H:%M:%S')  # Fecha y hora local en formato legible 

        conexion = conectar_db()
        cursor = conexion.cursor()

        # Guardamos el pedido principal
        cursor.execute("INSERT INTO pedidos (usuario_id, total, fecha) VALUES (%s, %s, %s)", (usuario_id, total, fecha_local))
        pedido_id = cursor.lastrowid 

        # Recorremos los productos y guardamos el detalle
        for item in detalles:
            producto_id = item['id']
            cantidad = item['cantidad']
            precio = item['precio']

            # Insertamos en la tabla 'detalles_pedido'
            cursor.execute("""
                INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) 
                VALUES (%s, %s, %s, %s)
            """, (pedido_id, producto_id, cantidad, precio))

            # Restamos el stock
            cursor.execute("UPDATE productos SET stock = stock - %s WHERE id = %s", (cantidad, producto_id))

        conexion.commit()
        cursor.close()
        conexion.close()

        return jsonify({"status": "ok", "mensaje": "Compra registrada exitosamente"})

    except Exception as e:
        print("Error en la compra:", e)
        # para ver en la consola de Python exactamente qué falla si hay un error
        return jsonify({"status": "error", "mensaje": f"Error: {str(e)}"})
    
# Ruta para obtener los pedidos de un cliente
@app.route('/pedidos/<int:usuario_id>', methods=['GET'])
def obtener_pedidos(usuario_id):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, total, estado, fecha 
            FROM pedidos 
            WHERE usuario_id = %s 
            ORDER BY fecha DESC
        """, (usuario_id,))
        
        pedidos = cursor.fetchall()
        
        for pedido in pedidos:
            if pedido['fecha']:
                pedido['fecha_texto'] = pedido['fecha'].strftime("%d/%m/%Y %H:%M")
            else:
                pedido['fecha_texto'] = "Fecha desconocida"
                
        cursor.close()
        conexion.close()
        
        return jsonify(pedidos)
        
    except Exception as e:
        print("Error al obtener pedidos:", e)
        
        return jsonify({"status": "error", "mensaje": str(e)})    

@app.route('/pedidos/detalle/<int:pedido_id>', methods=['GET'])
def obtener_detalle_pedido(pedido_id):
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        
        # Juntamos los detalles con los nombres de los productos
        cursor.execute("""
            SELECT p.nombre, dp.cantidad, dp.precio_unitario, (dp.cantidad * dp.precio_unitario) as subtotal
            FROM detalles_pedido dp
            JOIN productos p ON dp.producto_id = p.id
            WHERE dp.pedido_id = %s
        """, (pedido_id,))
        
        detalles = cursor.fetchall()
        
        cursor.close()
        conexion.close()
        
        return jsonify(detalles)
        
    except Exception as e:
        print("Error al obtener detalle del pedido:", e)
        return jsonify({"status": "error", "mensaje": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)