import subprocess
import base64
import time

def compile(message,inputvalue):
    code=message.value["data"]['answer']
    qid=message.value["data"]['qid']
    decoded_bytes = base64.b64decode(code)
    runcode = decoded_bytes.decode("utf-8")
    start_time = time.time()
    process = subprocess.run(['python3', '-c', runcode], input=inputvalue, capture_output=True, text=True,timeout=15)
    end_time = time.time()

    if process.returncode != 0:
        execution_time = end_time - start_time
        obj = {
            "ID": qid,
            "output": process.stderr,
            "executetime":execution_time
        }
        return obj

    else:
        output = process.stdout.strip()
        execution_time = end_time - start_time
        obj = {
            "ID": qid,
            "output": output,
            "executetime":execution_time
        }
        return obj
        


     