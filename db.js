const Users = [{
    id: 1,
    full_name: "Juan Wagner",
    username: "wgnr",
    email: "juanswagner@gmail.com",
    password: "admin",
    phone: "+5493416559542",
    address: "La Paz 1126",
    id_security_type: 1
}, {
    id: 2,
    full_name: "Otro usuario",
    username: "2ss",
    email: "2ss@gmail.com",
    password: "rock",
    phone: "+5493527996854",
    address: "Ocampo 1126",
    id_security_type: 2
}];

const Security_Types = [{
    id: 1,
    type: "Admin",
    description: "Admin role."
},
{
    id: 2,
    type: "User",
    description: "User role."
}];

const Dishes = [
    {
        "id": 666,
        "name": "Hamburguesa Clásica",
        "name_short": "HamClas",
        "description": "Hamburguesa 200g de carne, con lechuga y tomate.",
        "price": 350,
        "img_path": "./src/img/ham-clas.png",
        "is_available": true
    }
];

const Orders =[
    {
      "id": 5412,
      "number": 500,
      "address": "Montevideo 1212 1B",
      "created_at": "2020-06-18T21:11:34.536Z",
      "updated_at": "2020-06-18T21:11:34.536Z",
      "description": "1xHamClas 1xSandVegg",
      "status": [
        {
          "status": "En Preparaciòn",
          "timestamp": "2020-06-18T21:11:34.536Z"
        }
      ],
      "user": {
        "id": 5487,
        "full_name": "Freddie Mercury",
        "username": "queen_freddie",
        "email": "freddiemercury@gmail.com",
        "phone": 447712345678,
        "address": "Maipu 999 1º A",
        "id_security_type": 1
      },
      "payment": {
        "type": 2,
        "total": 650
      },
      "dishes": [
        {
          "dish": {
            "id": 666,
            "name": "Hamburguesa Clásica",
            "name_short": "HamClas",
            "description": "Hamburguesa 200g de carne, con lechuga y tomate.",
            "price": 350,
            "img_path": "./src/img/ham-clas.png",
            "is_available": true
          },
          "ordered": 3,
          "purchased_price": 250,
          "subtotal": 750
        }
      ]
    }
  ];
const passphrase = "kslasdkljj32kjek23jeljrewkljgkljvfklñjvkljgk4jtkñl34jkrj34ñlk5j34kl5ñklgvrlkgj34jtlk5gv4g54556gv4g65v34g56";

module.exports = { Users, passphrase, Security_Types, Dishes, Orders };