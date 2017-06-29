#!/usr/bin/python
#coding=utf-8
import email,sys
import mimetypes
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import smtplib
import os
import random
class sendEmail:
    #
    def sendEmail(self , authInfo, fromAdd, toAdd, subject , htmlText = None , files = None):

            strFrom = fromAdd
            strTo = toAdd

            server = authInfo.get('server')
            user = authInfo.get('user')
            passwd = authInfo.get('password')

            if not (server and user and passwd) :
                    print 'incomplete login info, exit now'
                    return


            msgRoot = MIMEMultipart('related')
            msgRoot['Subject'] = subject
            msgRoot['From'] = strFrom
            msgRoot['To'] = ",".join(strTo)
            msgRoot.preamble = 'This is a multi-part message in MIME format.'

            # Encapsulate the plain and HTML versions of the message body in an
            # 'alternative' part, so message agents can decide which they want to display.
            msgAlternative = MIMEMultipart('alternative')
            msgRoot.attach(msgAlternative)


            #msgText = MIMEText(plainText, 'plain', 'utf-8')
            #msgAlternative.attach(msgText)


            msgText = MIMEText(htmlText, 'html', 'utf-8')
            msgAlternative.attach(msgText)



            if files != None:
                for file in files:
                    if ".png" in file:
                        att = MIMEImage(open(file, 'rb').read())
                        att.add_header('Content-ID','00000001')
#                        att["Content-Type"] = 'application/octet-stream'
#                        att["Content-Disposition"] = 'attachment; filename="' + os.path.basename(file)+ '"'
                        msgRoot.attach(att)
                    else:
                        att = MIMEText(open(file, 'rb').read(), 'base64', 'utf-8')
                        att["Content-Type"] = 'application/octet-stream'
                        att["Content-Disposition"] = 'attachment; filename="' + os.path.basename(file)+ '"'
                        msgRoot.attach(att)


            smtp = smtplib.SMTP()

            smtp.set_debuglevel(0)
            smtp.connect(server)
            smtp.login(user, passwd)
            result = smtp.sendmail(strFrom, toAdd, msgRoot.as_string())
            print result;
            #smtp.sendmail()
            smtp.quit()


if __name__ == '__main__' :

        if len(sys.argv) >= 4:
            users=[['mail.letv.com','arksystem','ark0901.com','arksystem@letv.com']]
            #id=random.randint(0,len(users)-1)
            id=0
            print users[id]
            authInfo = {}
            authInfo['server'] = users[id][0]
            authInfo['user'] = users[id][1]
            authInfo['password'] = users[id][2]
            fromAdd = users[id][3]
            toAdd = sys.argv[1].split(",")
            subject = sys.argv[2]

            htmlText = sys.argv[3]
            #files = ['d:/2.txt' , 'd:/1.txt']
            files = None
            if len(sys.argv) >= 5:
            	files = sys.argv[4].split(",")
            sendEmail().sendEmail(authInfo, fromAdd, toAdd, subject , htmlText , files)

        else:
            print 'error' ,len(sys.argv)
            print 'sendMail to1,to2 title content [file1,file2]'
            for arg in sys.argv:
                print arg

