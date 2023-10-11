FROM python:latest

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000

COPY src/ /app
CMD ["python", "app.py"]