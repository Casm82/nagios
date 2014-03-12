#!/bin/sh
set -x 

SMON=1
SDAY=1
SYEAR=2014
SHOUR=0
SMIN=0
SSEC=0

EMON=`date +%m`
EDAY=`date +%d`
EYEAR=`date +%Y`
EHOUR=20
EMIN=11
ESEC=10

export LANG=C
BASE_DIR="."
reportfile="/tmp/Service_Availability_Report_`date +%B_%Y`.csv"

echo "Host,%Time Up,%Time Down,Technology" > $reportfile

# Read each service name from file
for SERVICE_GRP in `cat $BASE_DIR/src_services`; do
  wget --user nagiosadmin --password password -O /tmp/service_report -q \
    "http://nagios.domain.ru/nagios/cgi-bin/avail.cgi?show_log_entries=&servicegroup=$SERVICE_GRP&timeperiod=custom&timeperiod=custom&smon=$SMON&sday=$SDAY&syear=$SYEAR&shour=$SHOUR&smin=$SMIN&ssec=$SSEC&emon=$EMON&eday=$EDAY&eyear=$EYEAR&ehour=$EHOUR&emin=$EMIN&esec=$ESEC&rpttimeperiod=$TIMEPERIOD&assumeinitialstates=yes&assumestateretention=yes&assumestatesduringnotrunning=yes&includesoftstates=no&initialassumedhoststate=3&initialassumedservicestate=6&backtrack=4"

  for DATA in `egrep 'serviceOK' /tmp/service_report | awk -F '>' '{ print $6","$9 }' | \
                    sed 's/<\/td//g' | sed 's/ (.*%)d,/,/g'| sed 's/ //g'`; do
    echo "$DATA,$SERVICE" >> $reportfile
  done
done

