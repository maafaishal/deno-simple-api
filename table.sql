-- public.auctions definition

-- Drop table

-- DROP TABLE public.auctions;

CREATE TABLE public.auctions (
	auction_id serial NOT NULL,
	user_id numeric NOT NULL,
	product_name text NOT NULL,
	product_description text NOT NULL,
	product_image text NOT NULL,
	multiple int4 NOT NULL,
	initial_price int4 NOT NULL,
	final_price int4 NOT NULL,
	highest_bid int4 NOT NULL,
	duration int4 NOT NULL,
	status int4 NOT NULL,
	start_date date NULL,
	end_date date NULL,
	reasons text NULL,
	created_date date NOT NULL,
	updated_date date NOT NULL,
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
	bid_date date NOT NULL,
	CONSTRAINT bidding_history_pk PRIMARY KEY (bidding_history_id),
	CONSTRAINT bidding_history_fk FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON UPDATE CASCADE
);