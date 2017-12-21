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
    status data.recharge_status DEFAULT 'pending',
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
    client_ip text,
    description text,
    status data.transfer_status DEFAULT 'pending',
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
    notify_url text[],
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
    appid text NOT NULL,
    successed_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY KEY (id, appid)
);

CREATE INDEX ON data.refund
    (recharge_id);

