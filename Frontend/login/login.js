
import express from 'express';
import cors from 'cors';




const login = express();
login.use(express.json())
login.use(cors())