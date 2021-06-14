import argparse
import os
import logging

import boto3


def connectionFactory(config):
    logging.debug('Creating connection with the following args:' + str(config))
    session = boto3.session.Session()
    try:
        s3 = session.client(service_name=config['Service'],
                            endpoint_url=config['URL'],
                            aws_access_key_id=config['KeyID'],
                            aws_secret_access_key=config['SKA'],
                            region_name=config['Region'])
        return s3
    except Exception as e:
        logging.error('Error occurred because the app couldn\'t build connection with the Object Storage: ' + str(e))


def downloadUrlGenerator(filename):
    return 'https://storage.yandexcloud.net/' + filename


def getNamesRequest(s3, bucket):
    listOfFiles = []
    for files in s3.list_objects(Bucket=bucket)['Contents']:
        try:
            fileInfo = {'File': files['Key'], 'Owner': files['Owner']['DisplayName'], 'ETag': files['ETag'],
                        'Type Of Storage': files['StorageClass'], 'Last Modified': str(files['LastModified']),
                        'Size': files['Size'], 'Link': downloadUrlGenerator(bucket + '/' + files['Key'])}
            listOfFiles.append(fileInfo)
        except Exception as e:
            logging.error('Error occured while trying to get names of files from ' + bucket + ' ' +str(e))
    return listOfFiles


def getFilesRequest(s3, bucket, arrayOfFiles):
    for file in arrayOfFiles:
        try:
            request = s3.get_object(Bucket=bucket, Key=file['File'])
            with open(sortDownloadedFilesByDate(bucket, file['Last Modified']) + file['File'], 'wb') as f:
                content = request['Body'].read()
                f.write(content)
            logging.debug('File' + file['File'] + ' was downloaded')
        except Exception as e:
            logging.error('File' + file['File'] + ' couldn\'t be downloaded due to: ' + str(e))


def deleteFilesRequest(s3, bucket):
    forDeletion = []
    allFiles = getNamesRequest(s3, bucket)

    for file in allFiles:
        newMap = {'Key': file['File']}
        forDeletion.append(newMap)

    try:
        logging.debug('Deleting ' + str(forDeletion) + ' ...')
        s3.delete_objects(Bucket=bucket, Delete={'Objects': forDeletion})
    except Exception as e:
        logging.error('Could\'t run deletion Function' + str(e))


def postFilesRequest(path, s3, bucket):
    for filename in os.listdir(path):
        try:
            logging.debug('Uploading ' + filename + '...')
            s3.upload_file(path + filename, bucket, filename)
        except Exception as e:
            logging.error('Error while uploading ' + filename + str(e))


def run(args):

    s3 = connectionFactory(args)

    if args['Function'] == 'download':
        try:
            logging.debug('Downloading files from the bucket ' + args['Bucket'])
            getFilesRequest(s3, args['Bucket'], getNamesRequest(s3, args['Bucket']))
        except Exception as a:
            logging.error('Error While Downloading: ' + str(a))

    elif args['Function'] == 'upload':
        try:
            logging.debug('Uploading files from ' + args['Path'])
            postFilesRequest(args['Path'], s3, args['Bucket'])
        except Exception as b:
            logging.error('Error While Uploading: ' + str(b))

    elif args['Function'] == 'delete':
        try:
            logging.debug('Deleting all files from the bucket ' + args['Bucket'])
            deleteFilesRequest(s3, args['Bucket'])
        except Exception as c:
            logging.error('Error While Deleting: ' + str(c))

    elif args['Function'] == 'list':
        try:
            logging.debug('Listing files in ' + args['Bucket'])
            list = getNamesRequest(s3, args['Bucket'])
            for i in list:
                print(i)
        except Exception as c:
            logging.error('Error While listing files: ' + str(c))


def sortDownloadedFilesByDate(bucket, dailyFile):
    try:
        DOWNLOAD_FOLDER = '../downloads/'
        if not os.path.exists(DOWNLOAD_FOLDER):
            os.makedirs(DOWNLOAD_FOLDER)
        BUCKET_FOLDER = DOWNLOAD_FOLDER + bucket + '/'
        if not os.path.exists(BUCKET_FOLDER):
            os.makedirs(BUCKET_FOLDER)
        CURRENT_DATE_FOLDER = BUCKET_FOLDER + dailyFile.strftime("%Y-%m-%d") + '/'
        if not os.path.exists(CURRENT_DATE_FOLDER):
            os.makedirs(CURRENT_DATE_FOLDER)
            logging.debug("Successfully created the directory target: " + CURRENT_DATE_FOLDER)
        return CURRENT_DATE_FOLDER

    except OSError:
        logging.error("Creation of the directory failed")

if __name__ == '__main__':

    parser = argparse.ArgumentParser(
        description="""
    Functions available: download, upload, delete:
        1. function 'download' will download all files from the specified bucket
        2. function 'upload' will upload all files from Path to the specified bucket
        3. function 'delete' will delete all files from the specified bucket
        4. function 'list' will list all files from the specified bucket
    """, formatter_class=argparse.RawTextHelpFormatter)

    parser.add_argument('--s',
                        action='store',
                        dest='service',
                        help='Object storage service')
    parser.add_argument('--u',
                        action='store',
                        dest='url',
                        help='Object storage URL')
    parser.add_argument('--b',
                        action='store',
                        dest='bucket',
                        help='Object storage bucket')
    parser.add_argument('--f',
                        action='store',
                        dest='function',
                        help='Function to run')
    parser.add_argument('--p',
                        action='store',
                        dest='path',
                        help='''Path of folder to upload (Must start and end with '/'. ''')
    parser.add_argument('--k',
                        action='store',
                        dest='keyid',
                        help='User Key ID')
    parser.add_argument('--ska',
                        action='store',
                        dest='SKA',
                        help='User secret key access')
    parser.add_argument('--r',
                        action='store',
                        dest='region',
                        help='Object storage region')

    results = parser.parse_args()
    parsedParams = {'Service': results.service,
                    'URL': results.url,
                    'Bucket': results.bucket,
                    'Function': results.function,
                    'Path': results.path,
                    'KeyID': results.keyid,
                    'SKA': results.SKA,
                    'Region': results.region}

    try:
        logging.debug('Reading args ...')
        run(parsedParams)
        logging.debug('Done.')
    except Exception as e:
        logging.error('''The specified arguments are not valid, please re-run the script with '--h' to get more info''')
