#!/bin/sh
set -x 

SDAY=1
SMON=12
SYEAR=2013
SHOUR=0
SMIN=0
SSEC=0

EDAY=23
EMON=1
EYEAR=2014
EHOUR=20
EMIN=11
ESEC=10

TIMEPERIOD=workhours

export LANG=C
BASE_DIR="."
REPORTFILE="/tmp/Availability_Report_`date +%F`.csv"
TMP_REPORT=/tmp/hostgrp_report
rm $REPORTFILE
rm $TMP_REPORT

#echo "Host,%Time Up,%Time Down,Technology" > $REPORTFILE

# Read each hostgroup name from file
for hostgrp in `cat $BASE_DIR/src_hostgroups`; do
 wget --user nagiosadmin --password password -O $TMP_REPORT -q \
 "http://nagios.domain.ru/nagios/cgi-bin/avail.cgi?show_log_entries=&hostgroup=$hostgrp&timeperiod=custom&smon=$SMON&sday=$SDAY&syear=$SYEAR&shour=$SHOUR&smin=$SMIN&ssec=$SSEC&emon=$EMON&eday=$EDAY&eyear=$EYEAR&ehour=$EHOUR&emin=$EMIN&esec=$ESEC&rpttimeperiod=$TIMEPERIOD" 

DURATION=`grep "Duration"	$TMP_REPORT | awk -F '>' '{ print $2 }' | cut -d '<' -f 1`
DAYS=`echo $DURATION | awk -F ' ' '{ print $2}' | sed s/d//g`
HOURS=`echo $DURATION | awk -F ' ' '{ print $3}' | sed s/h//`
MINUTES=`echo $DURATION | awk -F ' ' '{ print $4}' | sed s/m//`
SEC=`echo $DURATION | awk -F ' ' '{ print $5}' | sed s/s//`
DURATION_SEC=`expr 60 \* \( 24 \* 60 \* $DAYS + 60 \* $HOURS + $MINUTES \) + $SEC`
echo -n "$DURATION_SEC;" >> $REPORTFILE

AVERAGE=`grep "Average" $TMP_REPORT | awk -F '>' '{ print $5","$7}' | sed 's/<\/[at]//g' | sed 's/ (.*%)d,/,/g' | sed 's/% (.*)d//'`
echo -n "$AVERAGE;" >> $REPORTFILE

  for data in `egrep 'dataOdd|dataEven' $TMP_REPORT | awk -F '>' '{ print $4","$7","$9 }' | \
				sed 's/<\/[at]//g' | sed 's/ (.*%)d,/,/g' | sed 's/ (.*)d//' | sed s/%//g | grep -v "host"`; do
    echo -n "$data;" >> $REPORTFILE
  done
done
