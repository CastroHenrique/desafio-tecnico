# Usa uma versão leve do Node.js
FROM node:20-slim

# Define a pasta de trabalho dentro do container
WORKDIR /home/node/app

# Copia apenas os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que a API vai usar
EXPOSE 3000

# Comando para iniciar o servidor (geralmente com nodemon para desenvolvimento)
CMD ["npm", "run", "dev"]