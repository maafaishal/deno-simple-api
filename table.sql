--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.19
-- Dumped by pg_dump version 9.6.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: auctions; Type: TABLE; Schema: public; Owner: fajarmac
--

CREATE TABLE public.auctions (
    auction_id integer NOT NULL,
    user_id numeric NOT NULL,
    product_name text NOT NULL,
    product_description text NOT NULL,
    product_image text,
    multiple integer NOT NULL,
    initial_price integer NOT NULL,
    final_price integer NOT NULL,
    highest_bid integer DEFAULT 0,
    duration integer NOT NULL,
    status integer DEFAULT 1,
    start_date timestamp(0) without time zone,
    end_date timestamp(0) without time zone,
    reasons text,
    created_date timestamp(0) without time zone NOT NULL,
    updated_date timestamp(0) without time zone NOT NULL,
    bid_count integer DEFAULT 0,
    product_images text[] NOT NULL,
    shop_name text NOT NULL
);


ALTER TABLE public.auctions OWNER TO fajarmac;

--
-- Name: auctions_auction_id_seq; Type: SEQUENCE; Schema: public; Owner: fajarmac
--

CREATE SEQUENCE public.auctions_auction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE public.auctions_auction_id_seq OWNER TO fajarmac;

--
-- Name: auctions_auction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fajarmac
--

ALTER SEQUENCE public.auctions_auction_id_seq OWNED BY public.auctions.auction_id;


--
-- Name: bidding_history; Type: TABLE; Schema: public; Owner: fajarmac
--

CREATE TABLE public.bidding_history (
    bidding_history_id integer NOT NULL,
    auction_id integer NOT NULL,
    user_id numeric NOT NULL,
    bid integer NOT NULL,
    bid_date timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.bidding_history OWNER TO fajarmac;

--
-- Name: bidding_history_auction_id_seq; Type: SEQUENCE; Schema: public; Owner: fajarmac
--

CREATE SEQUENCE public.bidding_history_auction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE public.bidding_history_auction_id_seq OWNER TO fajarmac;

--
-- Name: bidding_history_auction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fajarmac
--

ALTER SEQUENCE public.bidding_history_auction_id_seq OWNED BY public.bidding_history.auction_id;


--
-- Name: bidding_history_bidding_history_id_seq; Type: SEQUENCE; Schema: public; Owner: fajarmac
--

CREATE SEQUENCE public.bidding_history_bidding_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE public.bidding_history_bidding_history_id_seq OWNER TO fajarmac;

--
-- Name: bidding_history_bidding_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fajarmac
--

ALTER SEQUENCE public.bidding_history_bidding_history_id_seq OWNED BY public.bidding_history.bidding_history_id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: fajarmac
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    title text NOT NULL,
    detail text NOT NULL,
    created_date timestamp(0) without time zone,
    user_id integer NOT NULL,
    type character varying NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);


ALTER TABLE public.notification OWNER TO fajarmac;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: fajarmac
--

CREATE SEQUENCE public.notification_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_notification_id_seq OWNER TO fajarmac;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fajarmac
--

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;


--
-- Name: auctions auction_id; Type: DEFAULT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.auctions ALTER COLUMN auction_id SET DEFAULT nextval('public.auctions_auction_id_seq'::regclass);


--
-- Name: bidding_history bidding_history_id; Type: DEFAULT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.bidding_history ALTER COLUMN bidding_history_id SET DEFAULT nextval('public.bidding_history_bidding_history_id_seq'::regclass);


--
-- Name: bidding_history auction_id; Type: DEFAULT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.bidding_history ALTER COLUMN auction_id SET DEFAULT nextval('public.bidding_history_auction_id_seq'::regclass);


--
-- Name: notification notification_id; Type: DEFAULT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);


--
-- Name: auctions auctions_pk; Type: CONSTRAINT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_pk PRIMARY KEY (auction_id);


--
-- Name: bidding_history bidding_history_pk; Type: CONSTRAINT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.bidding_history
    ADD CONSTRAINT bidding_history_pk PRIMARY KEY (bidding_history_id);


--
-- Name: bidding_history bidding_history_fk; Type: FK CONSTRAINT; Schema: public; Owner: fajarmac
--

ALTER TABLE ONLY public.bidding_history
    ADD CONSTRAINT bidding_history_fk FOREIGN KEY (auction_id) REFERENCES public.auctions(auction_id) ON UPDATE CASCADE;


--
-- Name: TABLE auctions; Type: ACL; Schema: public; Owner: fajarmac
--

GRANT ALL ON TABLE public.auctions TO fajarmac_auction;


--
-- Name: SEQUENCE auctions_auction_id_seq; Type: ACL; Schema: public; Owner: fajarmac
--

REVOKE ALL ON SEQUENCE public.auctions_auction_id_seq FROM fajarmac;
GRANT ALL ON SEQUENCE public.auctions_auction_id_seq TO fajarmac WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.auctions_auction_id_seq TO fajarmac_deno WITH GRANT OPTION;


--
-- Name: TABLE bidding_history; Type: ACL; Schema: public; Owner: fajarmac
--

GRANT ALL ON TABLE public.bidding_history TO fajarmac_auction;


--
-- Name: SEQUENCE bidding_history_auction_id_seq; Type: ACL; Schema: public; Owner: fajarmac
--

REVOKE ALL ON SEQUENCE public.bidding_history_auction_id_seq FROM fajarmac;
GRANT ALL ON SEQUENCE public.bidding_history_auction_id_seq TO fajarmac WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.bidding_history_auction_id_seq TO fajarmac_deno WITH GRANT OPTION;


--
-- Name: SEQUENCE bidding_history_bidding_history_id_seq; Type: ACL; Schema: public; Owner: fajarmac
--

REVOKE ALL ON SEQUENCE public.bidding_history_bidding_history_id_seq FROM fajarmac;
GRANT ALL ON SEQUENCE public.bidding_history_bidding_history_id_seq TO fajarmac WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.bidding_history_bidding_history_id_seq TO fajarmac_deno WITH GRANT OPTION;


--
-- Name: TABLE notification; Type: ACL; Schema: public; Owner: fajarmac
--

GRANT ALL ON TABLE public.notification TO fajarmac_auction;


--
-- Name: SEQUENCE notification_notification_id_seq; Type: ACL; Schema: public; Owner: fajarmac
--

REVOKE ALL ON SEQUENCE public.notification_notification_id_seq FROM fajarmac;
GRANT ALL ON SEQUENCE public.notification_notification_id_seq TO fajarmac WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.notification_notification_id_seq TO fajarmac_deno WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--
