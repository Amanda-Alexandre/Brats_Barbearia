from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime, timedelta

app = Flask(__name__)

# Lista para armazenar os agendamentos
agendamentos = []

# Função para formatar a data
def formatar_data(data_hora_str):
    # Converte a string para datetime
    data_hora = datetime.strptime(data_hora_str, "%Y-%m-%dT%H:%M")
    # Retorna a data formatada para o padrão desejado
    return data_hora.strftime("%d de %B de %Y, às %H:%M")

# Função para verificar se o horário está disponível
def verificar_disponibilidade(data_hora):
    # Converte a data e hora recebida para o formato datetime
    data_hora = datetime.strptime(data_hora, "%Y-%m-%dT%H:%M")
    
    # Define o intervalo de horário permitido
    inicio_do_dia = data_hora.replace(hour=9, minute=0, second=0, microsecond=0)
    fim_do_dia = data_hora.replace(hour=20, minute=0, second=0, microsecond=0)
    
    # Verifica se a data está dentro do intervalo permitido de 09:00 às 20:00
    if data_hora < inicio_do_dia or data_hora > fim_do_dia:
        return False

    # Verifica o intervalo de 1 hora e 20 minutos entre os agendamentos
    for agendamento in agendamentos:
        agendamento_data = datetime.strptime(agendamento['data_hora'], "%Y-%m-%dT%H:%M")
        
        # Verifica se a data do agendamento está dentro do intervalo de 1h20min de diferença
        if abs(agendamento_data - data_hora) < timedelta(hours=1, minutes=20):
            return False

    return True

@app.route('/')
def index():
    # Passar os agendamentos formatados para o template
    for agendamento in agendamentos:
        agendamento['data_hora_formatada'] = formatar_data(agendamento['data_hora'])

    return render_template('index.html', agendamentos=agendamentos, mensagem=None)

@app.route('/agendar', methods=['POST'])
def agendar():
    nome = request.form.get('nome')
    data_hora = request.form.get('data_hora')

    # Verifica a disponibilidade do horário
    if not verificar_disponibilidade(data_hora):
        mensagem = "O horário selecionado não está disponível. Tente novamente."
        return render_template('index.html', agendamentos=agendamentos, mensagem=mensagem)

    # Adicionar o novo agendamento à lista
    agendamento = {"nome": nome, "data_hora": data_hora}
    agendamentos.append(agendamento)

    # Redirecionar de volta para a página principal
    return redirect(url_for('index'))

@app.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar(id):
    agendamento = agendamentos[id]

    if request.method == 'POST':
        nome = request.form.get('nome')
        data_hora = request.form.get('data_hora')

        # Verifica a disponibilidade do novo horário
        if not verificar_disponibilidade(data_hora):
            mensagem = "O novo horário selecionado não está disponível. Tente novamente."
            return render_template('editar.html', agendamento=agendamento, mensagem=mensagem)

        # Atualiza o agendamento com os novos dados
        agendamento['nome'] = nome
        agendamento['data_hora'] = data_hora

        # Redireciona para a página principal
        return redirect(url_for('index'))

    # Passa os dados do agendamento para o template de edição
    agendamento['data_hora_formatada'] = formatar_data(agendamento['data_hora'])
    return render_template('editar.html', agendamento=agendamento, id=id, mensagem=None)

@app.route('/remover/<int:id>')
def remover(id):
    # Remove o agendamento da lista pelo ID
    agendamentos.pop(id)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
