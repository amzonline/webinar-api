const query = require('lib/Query');
const util = require('util');

let response;

exports.ivsevent = async (event, context) => {

    const body = JSON.parse(event.body);
    const eventNo = body.eventNo;
    const status = body.status;
    console.log('body : ' + body)
    //console.log('eventNo : ' + body.eventNo)
    //console.log('status : ' + body.status)
    try {
        if (eventNo) {
            let sql = "";
            if (status == 'on') {
                sql += "    SELECT status FROM TB_EVENT ";
                sql += "    WHERE eventNo = :eventNo ";

                const statusInfo = await query.findOne(sql, {eventNo : eventNo});

                console.log("statusInfo : " + util.inspect(statusInfo))
                response = {
                    'statusCode': 200,
                    'body': JSON.stringify({
                        message : statusInfo
                    })
                }
            }
            else {
                sql += "    SELECT eventNo, eventName,  type, status, QnAOpen, expertOpen, needAuth, ";
                sql += "           startDate, endDate, maxCapacity, obsUrl, playbackKey, playbackUrl, downloadUrl, feedbackUrl  FROM TB_EVENT ";
                sql += "    WHERE eventNo = :eventNo  ";

                const ivsevent = await query.findOne(sql, {eventNo : eventNo});

                console.log("ivsevent : " + util.inspect(ivsevent))
                response = {
                    'statusCode': 200,
                    'body': JSON.stringify({
                        message : ivsevent
                    })
                }
            }
        }

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
