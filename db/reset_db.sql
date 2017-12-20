---------------------------
-- cd到init目录，执行：psql -U xjp -d yks -f 'up_db.sql'
---------------------------

\echo '---step1 清空与重建schema---'
drop schema if exists data cascade;
drop schema if exists extension cascade;
create schema if not exists data authorization xjp;
create schema if not exists extension authorization xjp;
alter database pay set search_path to data;
-- alter database "yks-test" set search_path to data,extension;


\echo '---step2 重建语言、扩展与表结构---'
-- create or replace language plpython3u;
-- create extension if not exists plv8;
-- create extension if not exists pgjwt with schema extension cascade;
\! perl -pi -e "s/REFERENCES(.*)?;/REFERENCES\1 ON DELETE SET NULL;/i" sql/data_table_create.sql;
\ir sql/data_table_create.sql;
\! perl -pi -e "s/ ON DELETE SET NULL//i" sql/data_table_create.sql;



\echo '---step3 重置view与函数---'

-- \ir function/view.sql;
-- \ir plv8_modules/_startup.sql;
-- \ir function/util.sql;
-- \ir auth/roles.sql;
-- \ir auth/privileges.sql;
-- \ir function/default.sql;
-- \ir function/validation.sql;
-- \ir function/trigger.sql;
-- \ir function/notify.sql;
-- \ir auth/login.sql;
-- \ir function/api.sql;


\echo '---step4 添加测试数据---'

set search_path to data; -- 立即生效

--二维码

-- \COPY qrcode from 'seeds/qrcode.csv' with csv header;

--医院/标准科室/科室/底层用户/患者/医生/医生配置/管理员用户/值班
-- \COPY hos from 'seeds/hos.csv' with csv header;
-- \COPY gb_dept from 'seeds/gb_dept.csv' with csv header;
-- \COPY dept from 'seeds/dept.csv' with csv header;
-- \COPY "user" from 'seeds/user.csv' with csv header;
-- \COPY doc from 'seeds/doc.csv' with csv header;
-- alter table doc_setting disable trigger all;
-- \COPY doc_setting from 'seeds/doc_setting.csv' with csv header;
-- alter table doc_setting enable trigger all;
-- \COPY admin_user from 'seeds/admin_user.csv' with csv header;
-- \COPY pat from 'seeds/pat.csv' with csv header;
-- \COPY duty from 'seeds/duty.csv' with csv header;


--消息/关注关系/评价
-- alter table follow disable trigger all;
-- \COPY follow from 'seeds/follow.csv' with csv header;
-- alter table follow enable trigger all;
-- \COPY msg from 'seeds/msg.csv' with csv header;
-- \COPY evaluate from 'seeds/evaluate.csv' with csv header;

-- --咨询/咨询回复
-- \COPY consult from 'seeds/consult.csv' with csv header;
-- \COPY consult_reply from 'seeds/consult_reply.csv' with csv header;

-- --礼物/礼物赠送记录
-- \COPY gift from 'seeds/gift.csv' with csv header;
-- \COPY gift_record from 'seeds/gift_record.csv' with csv header;

-- --微课系列/微课/微课购买记录
-- \COPY course_series from 'seeds/course_series.csv' with csv header;
-- \COPY course from 'seeds/course.csv' with csv header;
-- \COPY course_bought_record from 'seeds/course_bought_record.csv' with csv header;

-- --状态栏目/状态/状态评论
-- \COPY post_forum from 'seeds/post_forum.csv' with csv header;
-- \COPY post from 'seeds/post.csv' with csv header;
-- \COPY post_comment from 'seeds/post_comment.csv' with csv header;

-- --反馈建议
-- \COPY feedback from 'seeds/feedback.csv' with csv header;

-- --心意配置
-- \COPY mind_recharge_config from 'seeds/mind_recharge_config.csv' with csv header;

-- -- --微信菜单
-- -- \COPY mind_recharge_config from 'seeds/mind_recharge_config.csv' with csv header;

-- -- 处方
-- \COPY medicine from 'seeds/medicine.csv' with csv header;
-- \COPY shipping_address from 'seeds/shipping_address.csv' with csv header;
-- \COPY prescription from 'seeds/prescription.csv' with csv header;
-- \COPY prescription_item from 'seeds/prescription_item.csv' with csv header;



-- \echo '---step5 修改序列---'
-- ALTER SEQUENCE data.doc_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.dept_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.hos_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.pat_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.msg_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.qrcode_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.doc_setting_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.admin_user_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.user_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.consult_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.consult_reply_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.evaluate_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.feedback_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.course_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.duty_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.gift_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.gift_record_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.course_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.course_series_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.course_bought_record_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.post_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.post_forum_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.post_comment_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.mind_recharge_config_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.medicine_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.shipping_address_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.prescription_id_seq RESTART WITH 700;
-- ALTER SEQUENCE data.prescription_item_id_seq RESTART WITH 700;
