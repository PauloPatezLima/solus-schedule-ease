
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir requisições do frontend

# Configuração do banco de dados MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@"
    f"{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT')}/{os.getenv('MYSQL_DATABASE')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar o SQLAlchemy
db = SQLAlchemy(app)

# Definição dos modelos
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    isAdmin = db.Column(db.Boolean, default=False)

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.String(50), nullable=False)
    isAvailable = db.Column(db.Boolean, default=True)

class RoomReservation(db.Model):
    __tablename__ = 'room_reservations'
    id = db.Column(db.Integer, primary_key=True)
    roomId = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # formato: YYYY-MM-DD
    startTime = db.Column(db.String(5), nullable=False)  # formato: HH:MM
    endTime = db.Column(db.String(5), nullable=False)  # formato: HH:MM
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    room = db.relationship('Room', backref=db.backref('reservations', lazy=True))
    user = db.relationship('User', backref=db.backref('room_reservations', lazy=True))

class Car(db.Model):
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(100), nullable=False)
    plate = db.Column(db.String(10), nullable=False, unique=True)
    isAvailable = db.Column(db.Boolean, default=True)
    fuelLevel = db.Column(db.Integer, default=100)

class CarReservation(db.Model):
    __tablename__ = 'car_reservations'
    id = db.Column(db.Integer, primary_key=True)
    carId = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # formato: YYYY-MM-DD
    startTime = db.Column(db.String(5), nullable=False)  # formato: HH:MM
    endTime = db.Column(db.String(5), nullable=True)  # formato: HH:MM (pode ser nulo até a devolução)
    destination = db.Column(db.String(200), nullable=False)
    purpose = db.Column(db.String(200), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    returned = db.Column(db.Boolean, default=False)
    returnTime = db.Column(db.String(5), nullable=True)
    fuelLevelReturn = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    car = db.relationship('Car', backref=db.backref('reservations', lazy=True))
    user = db.relationship('User', backref=db.backref('car_reservations', lazy=True))

# Criar tabelas no banco de dados
with app.app_context():
    db.create_all()
    
    # Verificar se há usuários cadastrados, se não, criar usuários padrão
    if User.query.count() == 0:
        admin_user = User(
            name="Admin User",
            email="admin@solus.com",
            password="admin123",
            isAdmin=True
        )
        regular_user = User(
            name="Regular User", 
            email="user@solus.com", 
            password="user123", 
            isAdmin=False
        )
        db.session.add(admin_user)
        db.session.add(regular_user)
        db.session.commit()
        
    # Verificar se há salas cadastradas, se não, criar salas padrão
    if Room.query.count() == 0:
        rooms = [
            Room(name="Sala de Reunião", capacity="10 pessoas", isAvailable=True),
            Room(name="Sala Coworking", capacity="8 pessoas", isAvailable=True),
            Room(name="Sala Colab (Aquário)", capacity="6 pessoas", isAvailable=True)
        ]
        db.session.add_all(rooms)
        db.session.commit()
        
    # Verificar se há carros cadastrados, se não, criar carros padrão
    if Car.query.count() == 0:
        cars = [
            Car(model="Fiat Uno", plate="ABC-1234", isAvailable=True, fuelLevel=80),
            Car(model="VW Gol", plate="DEF-5678", isAvailable=True, fuelLevel=95),
            Car(model="Toyota Corolla", plate="GHI-9012", isAvailable=True, fuelLevel=70)
        ]
        db.session.add_all(cars)
        db.session.commit()

# Funções auxiliares
def to_dict(model):
    """Converte um modelo SQLAlchemy para dicionário"""
    return {column.name: getattr(model, column.name) 
            for column in model.__table__.columns}

# Rotas para autenticação
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email, password=password).first()
    
    if user:
        # Não enviar a senha para o frontend
        user_dict = to_dict(user)
        del user_dict['password']
        return jsonify({"success": True, "user": user_dict})
    else:
        return jsonify({"success": False, "message": "Credenciais inválidas"}), 401

# Rotas para salas
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([to_dict(room) for room in rooms])

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    room = Room.query.get_or_404(room_id)
    return jsonify(to_dict(room))

# Rotas para reservas de salas
@app.route('/api/room-reservations', methods=['GET'])
def get_room_reservations():
    date_filter = request.args.get('date')
    room_id = request.args.get('roomId')
    
    query = RoomReservation.query
    
    if date_filter:
        query = query.filter_by(date=date_filter)
    if room_id:
        query = query.filter_by(roomId=room_id)
    
    reservations = query.all()
    return jsonify([to_dict(reservation) for reservation in reservations])

@app.route('/api/room-reservations', methods=['POST'])
def create_room_reservation():
    data = request.json
    
    # Verificar disponibilidade apenas para o dia atual
    if data['date'] == datetime.now().strftime('%Y-%m-%d'):
        # Verificar se já existe reserva para a sala, data e horário
        conflicts = RoomReservation.query.filter_by(
            roomId=data['roomId'], 
            date=data['date']
        ).filter(
            ((RoomReservation.startTime <= data['startTime']) & (RoomReservation.endTime > data['startTime'])) |
            ((RoomReservation.startTime < data['endTime']) & (RoomReservation.endTime >= data['endTime']))
        ).count()
        
        if conflicts:
            return jsonify({"success": False, "message": "Sala já reservada para este horário"}), 409
    
    # Adicionar nova reserva
    new_reservation = RoomReservation(
        roomId=data['roomId'],
        date=data['date'],
        startTime=data['startTime'],
        endTime=data['endTime'],
        userId=data['userId']
    )
    
    db.session.add(new_reservation)
    
    # Atualizar disponibilidade da sala para o dia atual
    if data['date'] == datetime.now().strftime('%Y-%m-%d'):
        room = Room.query.get(data['roomId'])
        room.isAvailable = False
    
    db.session.commit()
    
    return jsonify({"success": True, "reservation": to_dict(new_reservation)})

# Rotas para carros
@app.route('/api/cars', methods=['GET'])
def get_cars():
    cars = Car.query.all()
    return jsonify([to_dict(car) for car in cars])

@app.route('/api/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    car = Car.query.get_or_404(car_id)
    return jsonify(to_dict(car))

# Rotas para reservas de carros
@app.route('/api/car-reservations', methods=['GET'])
def get_car_reservations():
    date_filter = request.args.get('date')
    car_id = request.args.get('carId')
    
    query = CarReservation.query
    
    if date_filter:
        query = query.filter_by(date=date_filter)
    if car_id:
        query = query.filter_by(carId=car_id)
    
    reservations = query.all()
    return jsonify([to_dict(reservation) for reservation in reservations])

@app.route('/api/car-reservations', methods=['POST'])
def create_car_reservation():
    data = request.json
    
    # Verificar disponibilidade apenas para o dia atual
    if data['date'] == datetime.now().strftime('%Y-%m-%d'):
        # Verificar se já existe reserva para o carro e data
        conflicts = CarReservation.query.filter_by(
            carId=data['carId'],
            date=data['date'],
            returned=False
        ).count()
        
        if conflicts:
            return jsonify({"success": False, "message": "Carro já reservado para esta data"}), 409
    
    # Adicionar nova reserva
    new_reservation = CarReservation(
        carId=data['carId'],
        date=data['date'],
        startTime=data['startTime'],
        endTime=data.get('endTime'),
        destination=data['destination'],
        purpose=data['purpose'],
        userId=data['userId'],
        returned=False
    )
    
    db.session.add(new_reservation)
    
    # Atualizar disponibilidade do carro para o dia atual
    if data['date'] == datetime.now().strftime('%Y-%m-%d'):
        car = Car.query.get(data['carId'])
        car.isAvailable = False
    
    db.session.commit()
    
    return jsonify({"success": True, "reservation": to_dict(new_reservation)})

# Rota para devolução de carros
@app.route('/api/car-return', methods=['PUT'])
def return_car():
    data = request.json
    reservation_id = data.get('reservationId')
    
    reservation = CarReservation.query.get_or_404(reservation_id)
    
    # Atualizar status da reserva
    reservation.returned = True
    reservation.returnTime = data.get('returnTime')
    reservation.endTime = data.get('endTime')
    reservation.fuelLevelReturn = data.get('fuelLevel')
    reservation.notes = data.get('notes', '')
    
    # Atualizar disponibilidade e nível de combustível do carro
    car = Car.query.get(reservation.carId)
    car.isAvailable = True
    car.fuelLevel = data.get('fuelLevel', car.fuelLevel)
    
    db.session.commit()
    
    return jsonify({"success": True, "reservation": to_dict(reservation)})

# Rotas para usuários
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    # Não enviar senhas para o frontend
    user_list = [to_dict(user) for user in users]
    for user in user_list:
        del user['password']
    return jsonify(user_list)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    
    # Verificar se o e-mail já está em uso
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"success": False, "message": "E-mail já cadastrado"}), 409
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        isAdmin=data.get('isAdmin', False)
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Não enviar a senha para o frontend
    user_dict = to_dict(new_user)
    del user_dict['password']
    
    return jsonify({"success": True, "user": user_dict})

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    
    # Verificar se o e-mail já está em uso por outro usuário
    if data.get('email') and data['email'] != user.email:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"success": False, "message": "E-mail já cadastrado"}), 409
    
    # Atualizar usuário
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    db.session.commit()
    
    # Não enviar a senha para o frontend
    user_dict = to_dict(user)
    del user_dict['password']
    
    return jsonify({"success": True, "user": user_dict})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # Verificar reservas associadas
    room_reservations = RoomReservation.query.filter_by(userId=user_id).count()
    car_reservations = CarReservation.query.filter_by(userId=user_id).count()
    
    if room_reservations > 0 or car_reservations > 0:
        return jsonify({
            "success": False, 
            "message": "Não é possível excluir o usuário, pois existem reservas associadas a ele"
        }), 400
    
    # Armazenar dados do usuário para retornar
    user_dict = to_dict(user)
    del user_dict['password']
    
    # Excluir usuário
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"success": True, "user": user_dict})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
