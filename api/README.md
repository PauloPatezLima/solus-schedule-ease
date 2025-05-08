
# Backend Flask para o Sistema Solus

Este é o backend em Flask que fornece APIs para o sistema Solus, substituindo o armazenamento local (localStorage) por uma API REST.

## Configuração

1. Instale as dependências:
```
pip install -r requirements.txt
```

2. Execute o servidor:
```
python app.py
```

O servidor será executado em `http://localhost:5000`.

## APIs disponíveis

### Autenticação
- `POST /api/login` - Autenticar usuário

### Salas
- `GET /api/rooms` - Listar todas as salas
- `GET /api/rooms/<room_id>` - Obter detalhes de uma sala

### Reservas de Salas
- `GET /api/room-reservations` - Listar reservas de salas (filtros opcionais: date, roomId)
- `POST /api/room-reservations` - Criar uma nova reserva de sala

### Carros
- `GET /api/cars` - Listar todos os carros
- `GET /api/cars/<car_id>` - Obter detalhes de um carro

### Reservas de Carros
- `GET /api/car-reservations` - Listar reservas de carros (filtros opcionais: date, carId)
- `POST /api/car-reservations` - Criar uma nova reserva de carro
- `PUT /api/car-return` - Registrar devolução de um carro

### Usuários
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar um novo usuário
- `PUT /api/users/<user_id>` - Atualizar um usuário
- `DELETE /api/users/<user_id>` - Excluir um usuário

## Estrutura de Arquivos de Dados

Os dados são armazenados em arquivos JSON na pasta `data`:

- `users.json` - Usuários
- `rooms.json` - Salas
- `room_reservations.json` - Reservas de salas
- `cars.json` - Carros
- `car_reservations.json` - Reservas de carros
