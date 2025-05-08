
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir requisições do frontend

# Simular banco de dados usando arquivos JSON
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# Arquivos para armazenar dados
USERS_FILE = os.path.join(DATA_DIR, "users.json")
ROOMS_FILE = os.path.join(DATA_DIR, "rooms.json")
ROOM_RESERVATIONS_FILE = os.path.join(DATA_DIR, "room_reservations.json")
CARS_FILE = os.path.join(DATA_DIR, "cars.json")
CAR_RESERVATIONS_FILE = os.path.join(DATA_DIR, "car_reservations.json")

# Inicializar arquivos de dados se não existirem
def init_data_file(file_path, default_data):
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump(default_data, f)

# Dados iniciais
init_data_file(USERS_FILE, [
    {"id": 1, "name": "Admin User", "email": "admin@solus.com", "password": "admin123", "isAdmin": True},
    {"id": 2, "name": "Regular User", "email": "user@solus.com", "password": "user123", "isAdmin": False}
])

init_data_file(ROOMS_FILE, [
    {"id": 1, "name": "Sala de Reunião", "isAvailable": True, "capacity": "10 pessoas"},
    {"id": 2, "name": "Sala Coworking", "isAvailable": True, "capacity": "8 pessoas"},
    {"id": 3, "name": "Sala Colab (Aquário)", "isAvailable": True, "capacity": "6 pessoas"}
])

init_data_file(ROOM_RESERVATIONS_FILE, [])

init_data_file(CARS_FILE, [
    {"id": 1, "model": "Fiat Uno", "plate": "ABC-1234", "isAvailable": True, "fuelLevel": 80},
    {"id": 2, "model": "VW Gol", "plate": "DEF-5678", "isAvailable": True, "fuelLevel": 95},
    {"id": 3, "model": "Toyota Corolla", "plate": "GHI-9012", "isAvailable": True, "fuelLevel": 70}
])

init_data_file(CAR_RESERVATIONS_FILE, [])

# Funções auxiliares para ler/escrever dados
def read_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def write_data(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f)

# Rotas para autenticação
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    users = read_data(USERS_FILE)
    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    
    if user:
        # Não enviar a senha para o frontend
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({"success": True, "user": safe_user})
    else:
        return jsonify({"success": False, "message": "Credenciais inválidas"}), 401

# Rotas para salas
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = read_data(ROOMS_FILE)
    return jsonify(rooms)

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    rooms = read_data(ROOMS_FILE)
    room = next((r for r in rooms if r['id'] == room_id), None)
    if room:
        return jsonify(room)
    return jsonify({"message": "Sala não encontrada"}), 404

# Rotas para reservas de salas
@app.route('/api/room-reservations', methods=['GET'])
def get_room_reservations():
    reservations = read_data(ROOM_RESERVATIONS_FILE)
    date_filter = request.args.get('date')
    room_id = request.args.get('roomId')
    
    if date_filter:
        reservations = [r for r in reservations if r['date'] == date_filter]
    if room_id:
        reservations = [r for r in reservations if r['roomId'] == room_id]
    
    return jsonify(reservations)

@app.route('/api/room-reservations', methods=['POST'])
def create_room_reservation():
    data = request.json
    reservations = read_data(ROOM_RESERVATIONS_FILE)
    
    # Verificar se já existe reserva para a sala, data e horário
    conflicts = [r for r in reservations 
                 if r['roomId'] == data['roomId'] 
                 and r['date'] == data['date']
                 and ((r['startTime'] <= data['startTime'] < r['endTime']) or 
                      (r['startTime'] < data['endTime'] <= r['endTime']))]
    
    if conflicts and data['date'] == datetime.now().strftime('%Y-%m-%d'):
        return jsonify({"success": False, "message": "Sala já reservada para este horário"}), 409
    
    # Adicionar nova reserva
    new_reservation = {
        "id": data.get('id', len(reservations) + 1),
        "roomId": data['roomId'],
        "date": data['date'],
        "startTime": data['startTime'],
        "endTime": data['endTime'],
        "userId": data['userId']
    }
    
    reservations.append(new_reservation)
    write_data(ROOM_RESERVATIONS_FILE, reservations)
    
    # Atualizar disponibilidade da sala
    rooms = read_data(ROOMS_FILE)
    for room in rooms:
        if room['id'] == int(data['roomId']) and data['date'] == datetime.now().strftime('%Y-%m-%d'):
            room['isAvailable'] = False
    
    write_data(ROOMS_FILE, rooms)
    
    return jsonify({"success": True, "reservation": new_reservation})

# Rotas para carros
@app.route('/api/cars', methods=['GET'])
def get_cars():
    cars = read_data(CARS_FILE)
    return jsonify(cars)

@app.route('/api/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    cars = read_data(CARS_FILE)
    car = next((c for c in cars if c['id'] == car_id), None)
    if car:
        return jsonify(car)
    return jsonify({"message": "Carro não encontrado"}), 404

# Rotas para reservas de carros
@app.route('/api/car-reservations', methods=['GET'])
def get_car_reservations():
    reservations = read_data(CAR_RESERVATIONS_FILE)
    date_filter = request.args.get('date')
    car_id = request.args.get('carId')
    
    if date_filter:
        reservations = [r for r in reservations if r['date'] == date_filter]
    if car_id:
        reservations = [r for r in reservations if r['carId'] == car_id]
    
    return jsonify(reservations)

@app.route('/api/car-reservations', methods=['POST'])
def create_car_reservation():
    data = request.json
    reservations = read_data(CAR_RESERVATIONS_FILE)
    
    # Verificar se já existe reserva para o carro, data e horário
    conflicts = [r for r in reservations 
                 if r['carId'] == data['carId'] 
                 and r['date'] == data['date']
                 and not r.get('returned', False)]
    
    if conflicts and data['date'] == datetime.now().strftime('%Y-%m-%d'):
        return jsonify({"success": False, "message": "Carro já reservado para esta data"}), 409
    
    # Adicionar nova reserva
    new_reservation = {
        "id": data.get('id', len(reservations) + 1),
        "carId": data['carId'],
        "date": data['date'],
        "startTime": data['startTime'],
        "endTime": data.get('endTime'),
        "destination": data['destination'],
        "purpose": data['purpose'],
        "userId": data['userId'],
        "returned": False
    }
    
    reservations.append(new_reservation)
    write_data(CAR_RESERVATIONS_FILE, reservations)
    
    # Atualizar disponibilidade do carro
    cars = read_data(CARS_FILE)
    for car in cars:
        if car['id'] == int(data['carId']) and data['date'] == datetime.now().strftime('%Y-%m-%d'):
            car['isAvailable'] = False
    
    write_data(CARS_FILE, cars)
    
    return jsonify({"success": True, "reservation": new_reservation})

# Rota para devolução de carros
@app.route('/api/car-return', methods=['PUT'])
def return_car():
    data = request.json
    reservation_id = data.get('reservationId')
    
    reservations = read_data(CAR_RESERVATIONS_FILE)
    reservation = next((r for r in reservations if r['id'] == reservation_id), None)
    
    if not reservation:
        return jsonify({"success": False, "message": "Reserva não encontrada"}), 404
    
    # Atualizar status da reserva
    reservation['returned'] = True
    reservation['returnTime'] = data.get('returnTime')
    reservation['endTime'] = data.get('endTime')  # Atualizar o horário de devolução
    reservation['fuelLevelReturn'] = data.get('fuelLevel')
    reservation['notes'] = data.get('notes', '')
    
    write_data(CAR_RESERVATIONS_FILE, reservations)
    
    # Atualizar disponibilidade e nível de combustível do carro
    cars = read_data(CARS_FILE)
    for car in cars:
        if car['id'] == int(reservation['carId']):
            car['isAvailable'] = True
            car['fuelLevel'] = data.get('fuelLevel', car['fuelLevel'])
    
    write_data(CARS_FILE, cars)
    
    return jsonify({"success": True, "reservation": reservation})

# Rotas para usuários
@app.route('/api/users', methods=['GET'])
def get_users():
    users = read_data(USERS_FILE)
    # Não enviar senhas para o frontend
    safe_users = [{k: v for k, v in user.items() if k != 'password'} for user in users]
    return jsonify(safe_users)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    users = read_data(USERS_FILE)
    
    # Verificar se o e-mail já está em uso
    if any(u['email'] == data['email'] for u in users):
        return jsonify({"success": False, "message": "E-mail já cadastrado"}), 409
    
    new_user = {
        "id": data.get('id', len(users) + 1),
        "name": data['name'],
        "email": data['email'],
        "password": data['password'],
        "isAdmin": data.get('isAdmin', False)
    }
    
    users.append(new_user)
    write_data(USERS_FILE, users)
    
    # Não enviar a senha para o frontend
    safe_user = {k: v for k, v in new_user.items() if k != 'password'}
    return jsonify({"success": True, "user": safe_user})

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    users = read_data(USERS_FILE)
    
    user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
    if user_index is None:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
    
    # Verificar se o e-mail já está em uso por outro usuário
    if data.get('email') and any(u['email'] == data['email'] and u['id'] != user_id for u in users):
        return jsonify({"success": False, "message": "E-mail já cadastrado"}), 409
    
    # Atualizar usuário
    updated_user = users[user_index].copy()
    for key, value in data.items():
        if key in updated_user:
            updated_user[key] = value
    
    users[user_index] = updated_user
    write_data(USERS_FILE, users)
    
    # Não enviar a senha para o frontend
    safe_user = {k: v for k, v in updated_user.items() if k != 'password'}
    return jsonify({"success": True, "user": safe_user})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    users = read_data(USERS_FILE)
    
    user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
    if user_index is None:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
    
    # Remover usuário
    deleted_user = users.pop(user_index)
    write_data(USERS_FILE, users)
    
    # Não enviar a senha para o frontend
    safe_user = {k: v for k, v in deleted_user.items() if k != 'password'}
    return jsonify({"success": True, "user": safe_user})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
