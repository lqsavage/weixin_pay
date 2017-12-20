CREATE TYPE data.recharge_trade_type AS ENUM('JSAPI', 'NATIVE', 'APP');

CREATE CAST (CHARACTER VARYING AS data.recharge_trade_type) WITH INOUT AS IMPLICIT;

CREATE TYPE data.recharge_status AS ENUM('pending', 'paid', 'refunded', 'reversed', 'failed');

CREATE CAST (CHARACTER VARYING AS data.recharge_status) WITH INOUT AS IMPLICIT;

CREATE TABLE data.recharge (
    id text NOT NULL,
    appid text NOT NULL,
    order_no text NOT NULL,
    amount int NOT NULL,
    body text,
    openid text NOT NULL,
    client_ip text,
    trade_type data.recharge_trade_type DEFAULT 'JSAPI',
    amount_refunded int,
    status data.recharge_status NOT NULL DEFAULT 'pending',
    failure_msg text,
    paid_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY KEY (id)
);

CREATE INDEX ON data.recharge
    (appid);


CREATE TYPE data.transfer_status AS ENUM('pending', 'paid', 'failed');

CREATE CAST (CHARACTER VARYING AS data.transfer_status) WITH INOUT AS IMPLICIT;

CREATE TABLE data.transfer (
    id text NOT NULL,
    appid text NOT NULL,
    openid text NOT NULL,
    amount int NOT NULL,
    order_no text NOT NULL,
    description text,
    status data.transfer_status NOT NULL DEFAULT 'pending',
    failure_msg text,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY KEY (id)
);

CREATE INDEX ON data.transfer
    (appid);


CREATE TABLE data.app (
    id text NOT NULL,
    wx_appid text,
    mchid text,
    name text,
    cert_path text,
    api_key text,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY KEY (id)
);


CREATE TYPE data.refund_status AS ENUM('pending', 'succeeded', 'failed');

CREATE CAST (CHARACTER VARYING AS data.refund_status) WITH INOUT AS IMPLICIT;

CREATE TABLE data.refund (
    id text NOT NULL,
    recharge_id text NOT NULL,
    amount int NOT NULL,
    description text,
    status data.refund_status DEFAULT 'pending',
    failure_msg text,
    successd_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY KEY (id)
);

CREATE INDEX ON data.refund
    (recharge_id);


ALTER TABLE data.recharge ADD CONSTRAINT FK_recharge__appid FOREIGN KEY (appid) REFERENCES data.app(id);
ALTER TABLE data.transfer ADD CONSTRAINT FK_transfer__appid FOREIGN KEY (appid) REFERENCES data.app(id);
ALTER TABLE data.refund ADD CONSTRAINT FK_refund__recharge_id FOREIGN KEY (recharge_id) REFERENCES data.recharge(id);