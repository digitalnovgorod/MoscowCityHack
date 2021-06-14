FROM python:3.8

LABEL author = "NOVGOROD.DIGITAL"

ENV dbuser = "admin" / dbpassword = "!234Qwer" / dbhost = "84.201.180.60" / dbname = "NOVGIS"

RUN mkdir yos-crawler-home

COPY . /yos-crawler-home

RUN pip install -r /yos-crawler-home/requirements.txt

WORKDIR /yos-crawler-home

CMD [ "python", "./app/main.py", "--h"]
ENTRYPOINT [ "python", "./app/main.py"]
