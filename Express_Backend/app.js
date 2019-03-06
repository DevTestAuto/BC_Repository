const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
const db = mysql.createConnection({
    host: '192.168.10.26',
    user: 'root',
    password: 'root',
    database: 'db_sp_eis'
});

db.connect();

app.get('/activeCompList', function (req, res) {
    var sql = 'SELECT * FROM tbl_companies WHERE status = 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/compList', function (req, res) {
    var sql = 'SELECT * FROM tbl_companies';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/data/:cid', function (req, res) {
    var QueryString;
    if (req.params.cid == 0) {
        QueryString = "SELECT * FROM tbl_employee WHERE id IN (SELECT MAX(id) FROM tbl_employee WHERE bc_count > 0 GROUP BY emp_uid) order by modified_date desc";
    } else {
        QueryString = 'SELECT * FROM tbl_employee where comp_id=' + req.params.cid +' order by modified_date desc';
    }
    db.query(QueryString, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/checkDuplicate/:efn/:eln/:fn/:eg/:dob/:pn', function (req, res) {
    var sql = "SELECT * FROM tbl_employee where emp_fname=" + "'" + req.params.efn + "'" + " and emp_lname=" + "'" + req.params.eln + "'" + " and gender=" + req.params.eg + " and date_of_birth=" + "'" + req.params.dob + "'" + " and pan_number=" + "'" + req.params.pn + "'" + " and  emp_fathername=" + "'" + req.params.fn + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//This method is used to search record based on employee unique id, id and firstname.
app.get('/search/:svalue/:cid', function (req, res) {
    if (req.params.cid === '0' || req.params.cid === 0) {
        var searchQuery = 'SELECT * FROM tbl_employee WHERE id IN (SELECT MAX(id) FROM tbl_employee WHERE (emp_uid=' + "'" + req.params.svalue + "'" + " or emp_id=" + "'" + req.params.svalue + "'" + " or emp_fname=" + "'" + req.params.svalue + "'" + " or emp_lname=" + "'" + req.params.svalue + "'" + ') and bc_count > 0 GROUP BY emp_uid) ORDER BY emp_uid asc';
    } else {
        var searchQuery = "SELECT * FROM tbl_employee where (emp_uid=" + "'" + req.params.svalue + "'" + " or emp_id=" + "'" + req.params.svalue + "'" + " or emp_fname=" + "'" + req.params.svalue + "'" + " or emp_lname=" + "'" + req.params.svalue + "'" + ") and comp_id=" + req.params.cid;
    } db.query(searchQuery, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//This method is used to fetch data based on UEN.
app.get('/fetchUidData/:empUid', function (req, res) {
    var searchQuery = "SELECT * FROM tbl_employee where emp_uid=" + "'" + req.params.empUid + "'";
    db.query(searchQuery, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/data', function (req, res) {
    var sql = 'SELECT count(distinct emp_uid) as count FROM tbl_employee';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/recordCount/:empUid', function (req, res) {
    var sql = "SELECT count(*) as totalCount, MAX(bc_count) as bcCount FROM tbl_employee where emp_uid=" + "'" + req.params.empUid + "'";;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/cmpCount', function (req, res) {
    var sql = 'SELECT count(*) as count FROM tbl_companies WHERE status = 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/bcEmpCount', function (req, res) {
    var sql = 'SELECT count(*) as count FROM tbl_employee where bc_count > 0';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/fetchBCData/:empUid', function (req, res) {
    var sql = "SELECT * FROM tbl_employee where emp_uid=" + "'" + req.params.empUid + "'" + " and bc_count > 0 order by modified_date desc";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/euid', function (req, res) {
    var sql = 'SELECT emp_uid FROM tbl_employee where bc_status=1 GROUP BY emp_uid';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/data/:eid/:cid', function (req, res) {
    var sql = 'SELECT * FROM tbl_employee where emp_id=' + req.params.eid + ' AND comp_id=' + req.params.cid +' order by modified_date desc';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/getCompList', function (req, res) {
    var sql = 'SELECT * FROM tbl_companies';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/getCompData/:cid', function (req, res) {
    var QueryString;
    QueryString = 'SELECT * FROM tbl_companies where comp_id=' + req.params.cid +' order by modified_date desc';
    db.query(QueryString, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/InsertReq/:doj/:uid', function (req, res) {
    var QueryString;
    var insertFlag = true;
    QueryString = 'select relieving_date from tbl_employee where emp_uid = ' + "'" + req.params.uid + "'";
    db.query(QueryString, (err, result) => {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {
            var dbrlgDate = (result[i].relieving_date).toString();
            var ipdoj = dateDisplayed(req.params.doj);
            var dbConrlgDate = dateDisplayed(dbrlgDate.split("00:00:00", 1));
            if (Date.parse(ipdoj) < Date.parse(dbConrlgDate)) {
                insertFlag = false;
                break;
            } else {
                insertFlag = true;
            }
        }
        if (insertFlag) {
            var data = {
                emp_uid: req.body.emp_uid, emp_id: req.body.emp_id,
                emp_fname: req.body.emp_fname, emp_lname: req.body.emp_lname,
                emp_fathername: req.body.emp_fathername, emp_avatar: req.body.emp_avatar,
                gender: req.body.gender, date_of_birth: req.body.date_of_birth,
                qualification: req.body.qualification, pan_number: req.body.pan_number,
                date_of_joining: req.body.date_of_joining, relieving_date: req.body.relieving_date,
                emp_type: req.body.emp_type, exit_type: req.body.exit_type,
                designation: req.body.designation, tech_expertise: req.body.tech_expertise,
                flag_verification: req.body.flag_verification, mgmt_status: req.body.mgmt_status,
                mgr_status: req.body.mgr_status, bc_status: req.body.bc_status,
                comp_id: req.body.comp_id, bc_count: req.body.bc_count,
                created_date: req.body.created_date, modified_date: req.body.modified_date
            };

            var sql = 'INSERT INTO tbl_employee SET ?';
            db.query(sql, data, (err, result) => {
                if (err) throw err;
                res.send({
                    status: '1',
                    emp_uid: req.body.emp_uid, emp_id: req.body.emp_id,
                    emp_fname: req.body.emp_fname, emp_lname: req.body.emp_lname,
                    emp_fathername: req.body.emp_fathername, emp_avatar: req.body.emp_avatar,
                    gender: req.body.gender, date_of_birth: req.body.date_of_birth,
                    qualification: req.body.qualification, pan_number: req.body.pan_number,
                    date_of_joining: req.body.date_of_joining, relieving_date: req.body.relieving_date,
                    emp_type: req.body.emp_type, exit_type: req.body.exit_type,
                    designation: req.body.designation, tech_expertise: req.body.tech_expertise,
                    flag_verification: req.body.flag_verification, mgmt_status: req.body.mgmt_status,
                    mgr_status: req.body.mgr_status, bc_status: req.body.bc_status,
                    comp_id: req.body.comp_id, bc_count: req.body.bc_count,
                    created_date: req.body.created_date, modified_date: req.body.modified_date
                });
            });
        } else {
            res.send({
                status: '2'
            });
        }
    });
});

app.post('/addCompReq', function (req, res) {
    var data = {
        comp_name: req.body.comp_name, comp_type: req.body.comp_type,
        website: req.body.website, created_date: req.body.created_date,
        modified_date: req.body.modified_date
    };

    var sql = 'INSERT INTO tbl_companies SET ?';
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({
            status: 'Data send successfully!',
            comp_name: req.body.comp_name, comp_type: req.body.comp_type,
            website: req.body.website, created_date: req.body.created_date,
            modified_date: req.body.modified_date
        });
    });
});


app.post('/editCompReq/:cid', function (req, res) {
    var data = {
        comp_name: req.body.comp_name, comp_type: req.body.comp_type,
        website: req.body.website, status: req.body.status, created_date: req.body.created_date,
        modified_date: req.body.modified_date
    };

    var sql = 'UPDATE tbl_companies set ? where comp_id=' + req.params.cid;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({
            status: 'Data edited successfully!',
            comp_name: req.body.comp_name, comp_type: req.body.comp_type,
            website: req.body.website, status: req.body.status, created_date: req.body.created_date,
            modified_date: req.body.modified_date
        });
    });
});

app.post('/UpdateReq/:eid/:cid', function (req, res) {
    var data = {
        
        emp_uid: req.body.emp_uid, emp_id: req.body.emp_id,
        emp_fname: req.body.emp_fname, emp_lname: req.body.emp_lname,
        emp_fathername: req.body.emp_fathername, emp_avatar: req.body.emp_avatar,
        gender: req.body.gender, date_of_birth: req.body.date_of_birth,
        qualification: req.body.qualification, pan_number: req.body.pan_number,
        date_of_joining: req.body.date_of_joining, relieving_date: req.body.relieving_date,
        emp_type: req.body.emp_type, exit_type: req.body.exit_type,
        designation: req.body.designation, tech_expertise: req.body.tech_expertise,
        flag_verification: req.body.flag_verification, mgmt_status: req.body.mgmt_status,
        mgr_status: req.body.mgr_status, bc_status: req.body.bc_status,
        comp_id: req.body.comp_id, bc_count: req.body.bc_count,
        created_date: req.body.created_date, modified_date: req.body.modified_date,
        bc_published_date: req.body.bc_published_date
    };
    var sql = 'UPDATE tbl_employee set ? where emp_id=' + req.params.eid + ' AND comp_id=' + req.params.cid;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({
            status: 'Data updated successfully!',
            emp_uid: req.body.emp_uid, emp_id: req.body.emp_id,
            emp_fname: req.body.emp_fname, emp_lname: req.body.emp_lname,
            emp_fathername: req.body.emp_fathername, emp_avatar: req.body.emp_avatar,
            gender: req.body.gender, date_of_birth: req.body.date_of_birth,
            qualification: req.body.qualification, pan_number: req.body.pan_number,
            date_of_joining: req.body.date_of_joining, relieving_date: req.body.relieving_date,
            emp_type: req.body.emp_type, exit_type: req.body.exit_type,
            designation: req.body.designation, tech_expertise: req.body.tech_expertise,
            flag_verification: req.body.flag_verification, mgmt_status: req.body.mgmt_status,
            mgr_status: req.body.mgr_status, bc_status: req.body.bc_status,
            comp_id: req.body.comp_id, bc_count: req.body.bc_count,
            created_date: req.body.created_date, modified_date: req.body.modified_date,
            bc_published_date: req.body.bc_published_date
        });
    });
});

app.listen(3210, () => {
    console.log('Server started successfully on port 3210')
});

// This method is used to handle date display
function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
}