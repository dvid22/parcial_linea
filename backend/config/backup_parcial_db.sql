--
-- PostgreSQL database dump
--

\restrict ymPN7bauKceIpl2Nrs9CiMv95uU2eg5mCwnFSD74kHXGkhdhGoyHmz0gZy9Tv8j

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-11-25 09:28:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 871 (class 1247 OID 24851)
-- Name: enum_horarios_dia; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_horarios_dia AS ENUM (
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
);


ALTER TYPE public.enum_horarios_dia OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 24866)
-- Name: enum_horarios_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_horarios_tipo AS ENUM (
    'orgánico',
    'reciclaje',
    'general'
);


ALTER TYPE public.enum_horarios_tipo OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 24905)
-- Name: enum_likes_value; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_likes_value AS ENUM (
    'like',
    'dislike'
);


ALTER TYPE public.enum_likes_value OWNER TO postgres;

--
-- TOC entry 859 (class 1247 OID 24810)
-- Name: enum_users_rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_rol AS ENUM (
    'usuario',
    'reciclador',
    'admin'
);


ALTER TYPE public.enum_users_rol OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24830)
-- Name: barrios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barrios (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    direccion text,
    descripcion text
);


ALTER TABLE public.barrios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24829)
-- Name: barrios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barrios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.barrios_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 219
-- Name: barrios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barrios_id_seq OWNED BY public.barrios.id;


--
-- TOC entry 226 (class 1259 OID 24889)
-- Name: comentarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    mensaje text NOT NULL,
    "tieneReciclaje" boolean DEFAULT false,
    contactos integer[] DEFAULT ARRAY[]::integer[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.comentarios OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24888)
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarios_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 225
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- TOC entry 224 (class 1259 OID 24874)
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    "sectorId" integer NOT NULL,
    dia public.enum_horarios_dia NOT NULL,
    hora character varying(255) NOT NULL,
    tipo public.enum_horarios_tipo DEFAULT 'general'::public.enum_horarios_tipo,
    frecuencia character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24873)
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 223
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- TOC entry 228 (class 1259 OID 24910)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "comentarioId" integer NOT NULL,
    value public.enum_likes_value NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24909)
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 227
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- TOC entry 230 (class 1259 OID 24930)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    "fromId" integer NOT NULL,
    "toId" integer NOT NULL,
    texto text NOT NULL,
    leido boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24929)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 229
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 222 (class 1259 OID 24839)
-- Name: sectores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectores (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    "barrioId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.sectores OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24838)
-- Name: sectores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sectores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sectores_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 221
-- Name: sectores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sectores_id_seq OWNED BY public.sectores.id;


--
-- TOC entry 218 (class 1259 OID 24818)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol public.enum_users_rol DEFAULT 'usuario'::public.enum_users_rol,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" bigint
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24817)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4786 (class 2604 OID 24833)
-- Name: barrios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios ALTER COLUMN id SET DEFAULT nextval('public.barrios_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 24892)
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 24877)
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 24913)
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 24933)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 24842)
-- Name: sectores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores ALTER COLUMN id SET DEFAULT nextval('public.sectores_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 24821)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5087 (class 0 OID 24830)
-- Dependencies: 220
-- Data for Name: barrios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.barrios (id, nombre, "createdAt", "updatedAt", direccion, descripcion) FROM stdin;
1	barrio norte 	2025-10-24 08:47:14.632-05	2025-10-24 08:47:14.632-05	\N	\N
2	barrio legua	2025-10-30 14:39:03.993-05	2025-10-30 14:39:03.993-05	\N	\N
3	legua	2025-10-30 14:52:28.475-05	2025-10-30 14:52:28.475-05	\N	\N
4	parcial	2025-10-30 15:01:25.024-05	2025-10-30 15:01:25.024-05	parcial	nuevo campo
5	pruebaparcial	2025-10-30 15:01:59.55-05	2025-10-30 15:01:59.55-05	parcial	nuevo campo
\.


--
-- TOC entry 5093 (class 0 OID 24889)
-- Dependencies: 226
-- Data for Name: comentarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comentarios (id, "userId", mensaje, "tieneReciclaje", contactos, "createdAt", "updatedAt") FROM stdin;
1	4	hola	f	{}	2025-10-24 09:21:08.675-05	2025-10-24 09:21:08.675-05
2	1	tengo botellas	t	{}	2025-10-24 12:03:43.027-05	2025-10-24 12:03:43.027-05
3	1	botellas plasticas	f	{}	2025-11-24 19:18:49.474-05	2025-11-24 19:18:49.474-05
\.


--
-- TOC entry 5091 (class 0 OID 24874)
-- Dependencies: 224
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (id, "sectorId", dia, hora, tipo, frecuencia, "createdAt", "updatedAt") FROM stdin;
1	1	Martes	10:05	orgánico	\N	2025-10-24 09:05:52.967-05	2025-10-24 09:05:52.967-05
2	3	Jueves	14:56	orgánico	\N	2025-10-30 14:53:55.094-05	2025-10-30 14:53:55.094-05
\.


--
-- TOC entry 5095 (class 0 OID 24910)
-- Dependencies: 228
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, "userId", "comentarioId", value, "createdAt", "updatedAt") FROM stdin;
1	4	1	dislike	2025-10-24 09:24:22.971-05	2025-10-24 09:24:25.34-05
\.


--
-- TOC entry 5097 (class 0 OID 24930)
-- Dependencies: 230
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, "fromId", "toId", texto, leido, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5089 (class 0 OID 24839)
-- Dependencies: 222
-- Data for Name: sectores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sectores (id, nombre, "barrioId", "createdAt", "updatedAt") FROM stdin;
1	centro	1	2025-10-24 09:05:33.724-05	2025-10-24 09:05:33.724-05
2	parcial	2	2025-10-30 14:39:25.401-05	2025-10-30 14:39:25.401-05
3	centro	3	2025-10-30 14:53:09.096-05	2025-10-30 14:53:09.096-05
\.


--
-- TOC entry 5085 (class 0 OID 24818)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nombre, email, password, rol, "createdAt", "updatedAt", "resetPasswordToken", "resetPasswordExpires") FROM stdin;
2	david	serniet@gmail.com	$2a$10$5L4xZC9UPJ71Li5FZLSou.9ywmq.W5khdJu0ovSRN.EEkr9uWd8sy	usuario	2025-10-23 15:15:55.4-05	2025-10-23 15:15:55.4-05	\N	\N
3	lorena	tnino@gmail.com	$2a$10$AiVTNKFWYCskc7k46Dd4ouIjIyzR3.bfEQZuGg0Zy5232G3It/bIW	usuario	2025-10-23 15:57:26.205-05	2025-10-23 15:57:26.205-05	\N	\N
4	prueba	prrueba@gmail.com	$2a$10$6013emYr45TZ9FLR1YUfL.vhGlgBjz9SA9zmWPcq/jjkpiryVLInK	usuario	2025-10-24 08:34:07.655-05	2025-10-24 08:34:07.655-05	\N	\N
1	sergio	serniet22@gmail.com	$2a$10$QoN2jHOHKaENTrXg4BkoN.qVaMEGgbrtdCD9Zap6taRJeWCSaxGJK	usuario	2025-10-23 15:07:00.912-05	2025-10-30 14:37:20.363-05	17100134cdf6159b5ac46deeb9ce0016d47a1484a26caa2caa40e50cef89ef09	1761856640360
\.


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 219
-- Name: barrios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.barrios_id_seq', 5, true);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 225
-- Name: comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comentarios_id_seq', 3, true);


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 223
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_id_seq', 2, true);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 227
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, true);


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 229
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 221
-- Name: sectores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sectores_id_seq', 3, true);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4859 (class 2606 OID 28157)
-- Name: barrios barrios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key UNIQUE (nombre);


--
-- TOC entry 4861 (class 2606 OID 28159)
-- Name: barrios barrios_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 4863 (class 2606 OID 28151)
-- Name: barrios barrios_nombre_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key10 UNIQUE (nombre);


--
-- TOC entry 4865 (class 2606 OID 28149)
-- Name: barrios barrios_nombre_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key11 UNIQUE (nombre);


--
-- TOC entry 4867 (class 2606 OID 28143)
-- Name: barrios barrios_nombre_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key12 UNIQUE (nombre);


--
-- TOC entry 4869 (class 2606 OID 28145)
-- Name: barrios barrios_nombre_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key13 UNIQUE (nombre);


--
-- TOC entry 4871 (class 2606 OID 28147)
-- Name: barrios barrios_nombre_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key14 UNIQUE (nombre);


--
-- TOC entry 4873 (class 2606 OID 28187)
-- Name: barrios barrios_nombre_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key15 UNIQUE (nombre);


--
-- TOC entry 4875 (class 2606 OID 28135)
-- Name: barrios barrios_nombre_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key16 UNIQUE (nombre);


--
-- TOC entry 4877 (class 2606 OID 28189)
-- Name: barrios barrios_nombre_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key17 UNIQUE (nombre);


--
-- TOC entry 4879 (class 2606 OID 28191)
-- Name: barrios barrios_nombre_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key18 UNIQUE (nombre);


--
-- TOC entry 4881 (class 2606 OID 28181)
-- Name: barrios barrios_nombre_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key19 UNIQUE (nombre);


--
-- TOC entry 4883 (class 2606 OID 28161)
-- Name: barrios barrios_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key2 UNIQUE (nombre);


--
-- TOC entry 4885 (class 2606 OID 28179)
-- Name: barrios barrios_nombre_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key20 UNIQUE (nombre);


--
-- TOC entry 4887 (class 2606 OID 28177)
-- Name: barrios barrios_nombre_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key21 UNIQUE (nombre);


--
-- TOC entry 4889 (class 2606 OID 28163)
-- Name: barrios barrios_nombre_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key22 UNIQUE (nombre);


--
-- TOC entry 4891 (class 2606 OID 28175)
-- Name: barrios barrios_nombre_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key23 UNIQUE (nombre);


--
-- TOC entry 4893 (class 2606 OID 28173)
-- Name: barrios barrios_nombre_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key24 UNIQUE (nombre);


--
-- TOC entry 4895 (class 2606 OID 28165)
-- Name: barrios barrios_nombre_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key25 UNIQUE (nombre);


--
-- TOC entry 4897 (class 2606 OID 28171)
-- Name: barrios barrios_nombre_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key26 UNIQUE (nombre);


--
-- TOC entry 4899 (class 2606 OID 28167)
-- Name: barrios barrios_nombre_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key27 UNIQUE (nombre);


--
-- TOC entry 4901 (class 2606 OID 28169)
-- Name: barrios barrios_nombre_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key28 UNIQUE (nombre);


--
-- TOC entry 4903 (class 2606 OID 28133)
-- Name: barrios barrios_nombre_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key29 UNIQUE (nombre);


--
-- TOC entry 4905 (class 2606 OID 28183)
-- Name: barrios barrios_nombre_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key3 UNIQUE (nombre);


--
-- TOC entry 4907 (class 2606 OID 28185)
-- Name: barrios barrios_nombre_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key4 UNIQUE (nombre);


--
-- TOC entry 4909 (class 2606 OID 28137)
-- Name: barrios barrios_nombre_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key5 UNIQUE (nombre);


--
-- TOC entry 4911 (class 2606 OID 28139)
-- Name: barrios barrios_nombre_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key6 UNIQUE (nombre);


--
-- TOC entry 4913 (class 2606 OID 28155)
-- Name: barrios barrios_nombre_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key7 UNIQUE (nombre);


--
-- TOC entry 4915 (class 2606 OID 28153)
-- Name: barrios barrios_nombre_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key8 UNIQUE (nombre);


--
-- TOC entry 4917 (class 2606 OID 28141)
-- Name: barrios barrios_nombre_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_nombre_key9 UNIQUE (nombre);


--
-- TOC entry 4919 (class 2606 OID 24835)
-- Name: barrios barrios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barrios
    ADD CONSTRAINT barrios_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 24898)
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 24882)
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 24915)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 24917)
-- Name: likes likes_userId_comentarioId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_comentarioId_key" UNIQUE ("userId", "comentarioId");


--
-- TOC entry 4932 (class 2606 OID 24938)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 24844)
-- Name: sectores sectores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT sectores_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 28097)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4799 (class 2606 OID 28099)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 28091)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 4803 (class 2606 OID 28113)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 4805 (class 2606 OID 28089)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 4807 (class 2606 OID 28115)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 4809 (class 2606 OID 28117)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 4811 (class 2606 OID 28119)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 4813 (class 2606 OID 28087)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 4815 (class 2606 OID 28121)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 4817 (class 2606 OID 28085)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 4819 (class 2606 OID 28083)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 4821 (class 2606 OID 28101)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 4823 (class 2606 OID 28081)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 4825 (class 2606 OID 28123)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 4827 (class 2606 OID 28125)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 4829 (class 2606 OID 28079)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 4831 (class 2606 OID 28075)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 4833 (class 2606 OID 28077)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 4835 (class 2606 OID 28073)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 4837 (class 2606 OID 28127)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 4839 (class 2606 OID 28071)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 4841 (class 2606 OID 28069)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 4843 (class 2606 OID 28103)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 4845 (class 2606 OID 28105)
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- TOC entry 4847 (class 2606 OID 28107)
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- TOC entry 4849 (class 2606 OID 28109)
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- TOC entry 4851 (class 2606 OID 28095)
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- TOC entry 4853 (class 2606 OID 28111)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 4855 (class 2606 OID 28093)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 4857 (class 2606 OID 24826)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4930 (class 1259 OID 24928)
-- Name: likes_user_id_comentario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX likes_user_id_comentario_id ON public.likes USING btree ("userId", "comentarioId");


--
-- TOC entry 4935 (class 2606 OID 28204)
-- Name: comentarios comentarios_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT "comentarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4934 (class 2606 OID 28197)
-- Name: horarios horarios_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT "horarios_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4936 (class 2606 OID 28218)
-- Name: likes likes_comentarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_comentarioId_fkey" FOREIGN KEY ("comentarioId") REFERENCES public.comentarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4937 (class 2606 OID 28213)
-- Name: likes likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4938 (class 2606 OID 28223)
-- Name: messages messages_fromId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4933 (class 2606 OID 28192)
-- Name: sectores sectores_barrioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT "sectores_barrioId_fkey" FOREIGN KEY ("barrioId") REFERENCES public.barrios(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-11-25 09:28:50

--
-- PostgreSQL database dump complete
--

\unrestrict ymPN7bauKceIpl2Nrs9CiMv95uU2eg5mCwnFSD74kHXGkhdhGoyHmz0gZy9Tv8j

