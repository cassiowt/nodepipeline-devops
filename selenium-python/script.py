from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Configuração do WebDriver (Substitua pelo caminho do seu chromedriver)
chrome_driver_path = "/opt/chromedriver"  # Exemplo: "C:/chromedriver.exe" no Windows


# Criando o serviço do ChromeDriver
service = Service(chrome_driver_path)
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Executar sem abrir o navegador (opcional)


# Inicializando o WebDriver corretamente
driver = webdriver.Chrome(service=service, options=options)

try:
    # 1️⃣ Acessa a página inicial da Hortti
    driver.get("https://hortti.com")
    print("Página carregada com sucesso:", driver.title)

    # 2️⃣ Aguarda a página carregar completamente
    time.sleep(3)

    # 3️⃣ Captura e exibe o título principal (caso exista)
    try:
        titulo = driver.find_element(By.TAG_NAME, "h1").text
        print(f"Título da página: {titulo}")
    except:
        print("Nenhum título principal encontrado.")

    # 4️⃣ Simular pesquisa (caso exista um campo de busca)
    try:
        search_box = driver.find_element(By.NAME, "q")  # Ajuste o NAME conforme o código-fonte da página
        search_box.send_keys("Banana")  # Exemplo de pesquisa
        search_box.send_keys(Keys.RETURN)
        time.sleep(3)
        print("Pesquisa realizada com sucesso!")
    except:
        print("Campo de pesquisa não encontrado.")

    # 5️⃣ Captura alguns produtos listados (caso existam)
    try:
        produtos = driver.find_elements(By.CLASS_NAME, "produto")  # Ajuste a classe conforme a página
        for i, produto in enumerate(produtos[:5]):  # Limita a exibição aos 5 primeiros
            print(f"Produto {i+1}: {produto.text}")
    except:
        print("Nenhum produto encontrado.")

finally:
    # Fecha o navegador
    driver.quit()
    print("Teste finalizado.")
