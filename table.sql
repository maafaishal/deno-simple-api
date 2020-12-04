-- public.auctions definition

-- Drop table

-- DROP TABLE public.auctions;

CREATE TABLE public.auctions (
	auction_id integer NOT NULL,
	user_id numeric NOT NULL,
	shop_name text NOT NULL,
	product_name text NOT NULL,
	product_description text NOT NULL,
	product_images text[] NOT NULL,
	multiple integer NOT NULL,
	initial_price integer NOT NULL,
	final_price integer NOT NULL,
	highest_bid integer DEFAULT 0,
	duration integer DEFAULT 1,
	status integer DEFAULT 1,
	start_date timestamp(0) without time zone NOT NULL,
	end_date timestamp(0) without time zone NOT NULL,
	reasons text,
	created_date timestamp(0) without time zone NOT NULL,
	updated_date timestamp(0) without time zone NOT NULL,
	bid_count integer DEFAULT 0,
	CONSTRAINT auctions_pk PRIMARY KEY (auction_id)
);


-- public.bidding_history definition

-- Drop table

-- DROP TABLE public.bidding_history;

CREATE TABLE public.bidding_history (
	bidding_history_id serial NOT NULL,
	auction_id serial NOT NULL,
	user_id numeric NOT NULL,
	bid int4 NOT NULL,
	bid_date timestamp(0) NULL,
	CONSTRAINT bidding_history_pk PRIMARY KEY (bidding_history_id),
	CONSTRAINT bidding_history_fk FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON UPDATE CASCADE
);

CREATE TABLE public.notification (
	notification_id serial NOT NULL,
	title text NOT NULL,
	detail text NOT NULL,
	created_date timestamp(0) NULL,
	user_id int4 NOT NULL,
	"type" varchar NOT NULL,
	is_read bool NOT NULL DEFAULT false
);