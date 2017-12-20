---------------------------
-- cd到init目录，执行：psql -U xjp -d pay -f 'reset_db.sql'
---------------------------

\echo '---step1 清空与重建schema---'
drop schema if exists data cascade;
create schema if not exists data authorization xjp;
alter database pay set search_path to data;


\echo '---step2 重建语言、扩展与表结构---'

\! perl -pi -e "s/REFERENCES(.*)?;/REFERENCES\1 ON DELETE SET NULL;/i" sql/data_table_create.sql;
\ir sql/data_table_create.sql;
\! perl -pi -e "s/ ON DELETE SET NULL//i" sql/data_table_create.sql;


\echo '---step3 重置view与函数---'

-- \ir function/view.sql;


\echo '---step4 添加测试数据---'

set search_path to data; -- 立即生效

--二维码

-- \COPY qrcode from 'seeds/qrcode.csv' with csv header;


-- \echo '---step5 修改序列---'
-- ALTER SEQUENCE data.doc_id_seq RESTART WITH 700;
