# Slush2023_Tasks_Manager

#Live Link: Was posted at heroku. NOT ANYMORE.

Web Application made for Slush 2023 interview.

A simple task sharing application made for slush2023 junior fullstack developer interview, that enables you to easier collaborate with your team members. With this app, you have the ability to create, modify, delete, share, and unshare tasks with ease. The dashboard provides an overview of all the tasks shared by your colleagues.

# Server posted on Heroku, Database on Amazon RDS

Made in React / TypeScript Libraries (client), NodeJs, Expressjs, Postgresql (Server) 

# Libraries //

Server:


Dotenv	


pg			


jsonwebtoken	


Client:


react-tabs


React-Router-Dom	


react-paginate


@chakra-ui/button


bcrypt		

# Database schema : 

users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


exercises (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


shared_exercises (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id),
  shared_by VARCHAR REFERENCES users(username),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
# Screenshots 
![one](https://user-images.githubusercontent.com/94826253/221431571-985a9fa1-d35d-461e-9856-e29cacc0a002.png)
![2](https://user-images.githubusercontent.com/94826253/221431575-3f33c2f9-b937-454a-ac08-81c77fb918d1.png)
![3](https://user-images.githubusercontent.com/94826253/221431576-c94ed4d6-11c7-4835-9228-3a7848eea537.png)
![4](https://user-images.githubusercontent.com/94826253/221431577-826d7f38-7223-4359-940f-a33596d2b602.png)
![5](https://user-images.githubusercontent.com/94826253/221431578-792408d2-2926-453b-a369-5ef141f0b2ba.png)
![6](https://user-images.githubusercontent.com/94826253/221431580-2b42c919-e07e-4f78-9b4e-3fbf95af7807.png)
![7](https://user-images.githubusercontent.com/94826253/221431582-8228554f-eb44-4b22-beee-f1bd34c4d571.png)
