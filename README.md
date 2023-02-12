# Slush2023_Tasks_Manager

#Live Link: https://slush2023.herokuapp.com/

Web Application made for Slush 2023 interview.

A simple task sharing application made for slush2023 junior fullstack developer interview, that enables you to easier collaborate with your team members. With this app, you have the ability to create, modify, delete, share, and unshare tasks with ease. The dashboard provides an overview of all the tasks shared by your colleagues.

# Server posted on Heroku, Database on Amazon RDS

# Made in React / TypeScript Libraries (client), NodeJs, Expressjs, Postgresql (Server) 

Libraries //

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
