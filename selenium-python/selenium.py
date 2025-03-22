from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Configura o driver do navegador (neste exemplo, Chrome)
driver = webdriver.Chrome()

try:
    # Abre a página hortti.com
    driver.get("https://hortti.com")

    # Aguarda alguns segundos para garantir que a página carregue completamente
    time.sleep(5)

    # Exemplo de interação: Verifica o título da página
    assert "Hortti" in driver.title

    # Exemplo de interação: Busca um elemento pelo nome e interage com ele
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys("produtos")
    search_box.send_keys(Keys.RETURN)

    # Aguarda alguns segundos para garantir que os resultados carreguem
    time.sleep(5)

    # Verifica se os resultados da busca contêm a palavra "produtos"
    assert "produtos" in driver.page_source

finally:
    # Fecha o navegador
    driver.quit()