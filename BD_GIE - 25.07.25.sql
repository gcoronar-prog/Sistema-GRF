PGDMP                      }            BD_GRF    16.3    16.3 �   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    BD_GRF    DATABASE     {   CREATE DATABASE "BD_GRF" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "BD_GRF";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            K           1255    41963    INSERT_rango_fecha()    FUNCTION     K  CREATE FUNCTION public."INSERT_rango_fecha"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF TO_CHAR(NEW.fecha_informe,'HH24:MI') 
	BETWEEN '00:00' AND '03:59' THEN
		NEW.rango_horario := '00:00 - 03:59';
	ELSEIF TO_CHAR(NEW.fecha_informe,'HH24:MI')
		BETWEEN '04:00' AND '07:59' THEN
		NEW.rango_horario := '04:00 - 07:59';
	ELSEIF TO_CHAR(NEW.fecha_informe,'HH24:MI')
		BETWEEN '08:00' AND '11:59' THEN
		NEW.rango_horario := '08:00 - 11:59';
	ELSEIF TO_CHAR(NEW.fecha_informe,'HH24:MI')
		BETWEEN '12:00' AND '15:59' THEN
		NEW.rango_horario := '12:00 - 15:59';
	ELSIF TO_CHAR(NEW.fecha_informe,'HH24:MI')
		BETWEEN '16:00' AND '19:59' THEN
		NEW.rango_horario := '16:00 - 19:59';
	ELSEIF TO_CHAR(NEW.fecha_informe,'HH24:MI')
		BETWEEN '20:00' AND '23:59' THEN
		NEW.rango_horario := '20:00 - 23:59';
	END IF;
	RETURN NEW;
END;$$;
 -   DROP FUNCTION public."INSERT_rango_fecha"();
       public          postgres    false    4            :           1255    25224    actualizar_valor_total()    FUNCTION     �   CREATE FUNCTION public.actualizar_valor_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  NEW.precio_total = NEW.precio_unitario * NEW.existencias;
  RETURN NEW;
END;$$;
 /   DROP FUNCTION public.actualizar_valor_total();
       public          postgres    false    4            Q           1255    75570    auditoria_acciones()    FUNCTION     
  CREATE FUNCTION public.auditoria_acciones() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
IF (TG_OP = 'INSERT') THEN
	INSERT INTO auditorias_acciones (accion,datos_new)
	VALUES ('INSERT',to_jsonb(NEW));
	RETURN NEW;
ELSEIF (TG_OP = 'UPDATE') THEN
	INSERT INTO auditorias_acciones (accion,datos_new,datos_old)
	VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
	RETURN NEW;
ELSEIF (TG_OP = 'DELETE') THEN
	INSERT INTO auditorias_acciones (accion,datos_old)
	VALUES ('DELETE',to_jsonb(OLD));
	RETURN OLD;
END IF;
END;$$;
 +   DROP FUNCTION public.auditoria_acciones();
       public          postgres    false    4            S           1255    75583    auditoria_adjunto()    FUNCTION     !  CREATE FUNCTION public.auditoria_adjunto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_doc_adjuntos (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_doc_adjuntos (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_doc_adjuntos (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 *   DROP FUNCTION public.auditoria_adjunto();
       public          postgres    false    4            V           1255    75619    auditoria_contribuyente()    FUNCTION     -  CREATE FUNCTION public.auditoria_contribuyente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_contribuyentes (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_contribuyentes (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_contribuyentes (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 0   DROP FUNCTION public.auditoria_contribuyente();
       public          postgres    false    4            T           1255    75595    auditoria_expediente()    FUNCTION     !  CREATE FUNCTION public.auditoria_expediente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_expedientes (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_expedientes (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_expedientes (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 -   DROP FUNCTION public.auditoria_expediente();
       public          postgres    false    4            U           1255    75607    auditoria_infraccion()    FUNCTION     $  CREATE FUNCTION public.auditoria_infraccion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_infracciones (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_infracciones (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_infracciones (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 -   DROP FUNCTION public.auditoria_infraccion();
       public          postgres    false    4            O           1255    74734    auditoria_origen_central()    FUNCTION     &  CREATE FUNCTION public.auditoria_origen_central() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_origen_central (accion,datos)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_origen_central (accion,datos,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_origen_central (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 1   DROP FUNCTION public.auditoria_origen_central();
       public          postgres    false    4            R           1255    75519    auditoria_tipo_central()    FUNCTION     &  CREATE FUNCTION public.auditoria_tipo_central() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_tipo_central (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_tipo_central (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_tipo_central (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 /   DROP FUNCTION public.auditoria_tipo_central();
       public          postgres    false    4            L           1255    75536    auditoria_ubicacion_central()    FUNCTION     :  CREATE FUNCTION public.auditoria_ubicacion_central() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_ubicacion_central (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_ubicacion_central (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_ubicacion_central (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 4   DROP FUNCTION public.auditoria_ubicacion_central();
       public          postgres    false    4            W           1255    75631    auditoria_vehi_contri()    FUNCTION     "  CREATE FUNCTION public.auditoria_vehi_contri() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_vehi_contri (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_vehi_contri (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_vehi_contri (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 .   DROP FUNCTION public.auditoria_vehi_contri();
       public          postgres    false    4            M           1255    75548    auditoria_vehiculo_central()    FUNCTION     6  CREATE FUNCTION public.auditoria_vehiculo_central() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF(TG_OP = 'INSERT') THEN
		INSERT INTO auditorias_vehiculo_central (accion,datos_new)
		VALUES ('INSERT',to_jsonb(NEW));
		RETURN NEW;
	ELSEIF (TG_OP = 'UPDATE') THEN
		INSERT INTO auditorias_vehiculo_central (accion,datos_new,datos_old)
		VALUES ('UPDATE',to_jsonb(NEW),to_jsonb(OLD));
		RETURN NEW;
	ELSEIF (TG_OP = 'DELETE') THEN
		INSERT INTO auditorias_vehiculo_central (accion,datos_old)
		VALUES ('DELETE',to_jsonb(OLD));
		RETURN OLD;
	END IF;
END;$$;
 3   DROP FUNCTION public.auditoria_vehiculo_central();
       public          postgres    false    4            8           1255    17144    codigo_alfa()    FUNCTION     �   CREATE FUNCTION public.codigo_alfa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
	current_year TEXT;
	
BEGIN
	current_year = TO_CHAR(NOW(),'YYYY');
	
	new.cod_alfa = new.id_alfa || '-' || current_year;
	RETURN NEW;
END;
$$;
 $   DROP FUNCTION public.codigo_alfa();
       public          postgres    false    4            =           1255    25412    codigo_atencion()    FUNCTION     �   CREATE FUNCTION public.codigo_atencion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_atencion = 'SGC' || NEW.id_atencion;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_atencion();
       public          postgres    false    4            7           1255    16974    codigo_expedientes()    FUNCTION     �   CREATE FUNCTION public.codigo_expedientes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.id_expediente = 'IPC' || new.id_exp;
	RETURN NEW;
END;
$$;
 +   DROP FUNCTION public.codigo_expedientes();
       public          postgres    false    4            ;           1255    25235    codigo_imagenes()    FUNCTION     �   CREATE FUNCTION public.codigo_imagenes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_solicitud = 'SIMG' || NEW.id_solicitud;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_imagenes();
       public          postgres    false    4            ?           1255    25514    codigo_informe()    FUNCTION     �   CREATE FUNCTION public.codigo_informe() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_informes_central = 'CINF' || NEW.id_informes_central;
	RETURN NEW;
END;$$;
 '   DROP FUNCTION public.codigo_informe();
       public          postgres    false    4            9           1255    17262    codigo_inventario()    FUNCTION     �   CREATE FUNCTION public.codigo_inventario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_producto = 'BM' || NEW.id_producto;
	RETURN NEW;
END;$$;
 *   DROP FUNCTION public.codigo_inventario();
       public          postgres    false    4            >           1255    25439    codigo_servicio()    FUNCTION     �   CREATE FUNCTION public.codigo_servicio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_reporte_service = 'CRSV' || NEW.id_reporte_service;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_servicio();
       public          postgres    false    4            P           1255    58354    delete_f_citacion()    FUNCTION     �  CREATE FUNCTION public.delete_f_citacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE proced TEXT;
BEGIN
	SELECT tipo_procedimiento INTO proced
	FROM expedientes 
	WHERE id_expediente = new.id_expediente;

  IF proced IN ('Notificación', 'Causas', 'Solicitudes') THEN
    NEW.fecha_citacion := NULL;
ELSE
	NEW.fecha_citacion := to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS');
  END IF;
  RETURN NEW;
END;
$$;
 *   DROP FUNCTION public.delete_f_citacion();
       public          postgres    false    4            6           1255    66534    fecha_crea_informe()    FUNCTION     �   CREATE FUNCTION public.fecha_crea_informe() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF NEW.id_origen_informe IS NOT NULL THEN
		NEW.fecha_doc_central := to_char(NOW(),'YYYY-MM-DD"T"HH24:MI:SS');
	END IF;
RETURN NEW;
END;$$;
 +   DROP FUNCTION public.fecha_crea_informe();
       public          postgres    false    4            N           1255    58357    fecha_expediente()    FUNCTION     �   CREATE FUNCTION public.fecha_expediente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
 IF NEW.id_exp IS NOT NULL THEN
	NEW.fecha_documento := to_char(NOW(),'YYYY-MM-DD"T"HH24:MI:SS');
END IF;
	RETURN NEW;
END;$$;
 )   DROP FUNCTION public.fecha_expediente();
       public          postgres    false    4            5           1255    58348    fecha_resuelto()    FUNCTION     (  CREATE FUNCTION public.fecha_resuelto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.estado_exp IN ('Resuelto', 'Despachado', 'Nulo') THEN
    NEW.fecha_resolucion := to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS');
ELSE
	NEW.fecha_resolucion := NULL;
  END IF;
  RETURN NEW;
END;
$$;
 '   DROP FUNCTION public.fecha_resuelto();
       public          postgres    false    4            <           1255    25303    insercion_clave_imagenes()    FUNCTION     �  CREATE FUNCTION public.insercion_clave_imagenes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
   -- Recuperar datos de las otras tablas basándose en los IDs insertados
    UPDATE tabla_central
    SET
        id_usuario = (SELECT id FROM datos_solicitud_usuarios WHERE id = NEW.id_usuario),
        id_responsable = (SELECT id FROM datos_solicitud_responsable WHERE id = NEW.id_responsable),
        id_grabacion = (SELECT id FROM datos_solicitud_grabacion WHERE id = NEW.id_grabacion),
        id_denuncia = (SELECT id FROM datos_solicitud_denuncia WHERE id = NEW.id_denuncia)
    WHERE id = NEW.id;

    -- Puedes agregar lógica adicional aquí si es necesario.

    RETURN NEW;
END$$;
 1   DROP FUNCTION public.insercion_clave_imagenes();
       public          postgres    false    4            �            1259    16585    acciones    TABLE       CREATE TABLE public.acciones (
    cod_accion integer NOT NULL,
    fecha_accion timestamp without time zone,
    desc_acciones character varying,
    estado_accion character varying,
    fecha_resolucion timestamp without time zone,
    cod_document character varying
);
    DROP TABLE public.acciones;
       public         heap    postgres    false    4            �            1259    16584    acciones_cod_accion_seq    SEQUENCE     �   CREATE SEQUENCE public.acciones_cod_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.acciones_cod_accion_seq;
       public          postgres    false    218    4            �           0    0    acciones_cod_accion_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.acciones_cod_accion_seq OWNED BY public.acciones.cod_accion;
          public          postgres    false    217                       1259    25373    atencion_ciudadana    TABLE     �   CREATE TABLE public.atencion_ciudadana (
    id_atencion integer NOT NULL,
    cod_atencion character varying NOT NULL,
    id_atencion_usuario integer,
    id_atencion_sector integer,
    id_atencion_solicitud integer,
    id_atencion_proceso integer
);
 &   DROP TABLE public.atencion_ciudadana;
       public         heap    postgres    false    4                       1259    25372 "   atencion_ciudadana_id_atencion_seq    SEQUENCE     �   CREATE SEQUENCE public.atencion_ciudadana_id_atencion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.atencion_ciudadana_id_atencion_seq;
       public          postgres    false    272    4            �           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.atencion_ciudadana_id_atencion_seq OWNED BY public.atencion_ciudadana.id_atencion;
          public          postgres    false    271            *           1259    75561    auditorias_acciones    TABLE     �   CREATE TABLE public.auditorias_acciones (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 '   DROP TABLE public.auditorias_acciones;
       public         heap    postgres    false    4            )           1259    75560 $   auditorias_acciones_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_acciones_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.auditorias_acciones_id_auditoria_seq;
       public          postgres    false    4    298                        0    0 $   auditorias_acciones_id_auditoria_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.auditorias_acciones_id_auditoria_seq OWNED BY public.auditorias_acciones.id_auditoria;
          public          postgres    false    297            2           1259    75610    auditorias_contribuyentes    TABLE     �   CREATE TABLE public.auditorias_contribuyentes (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 -   DROP TABLE public.auditorias_contribuyentes;
       public         heap    postgres    false    4            1           1259    75609 *   auditorias_contribuyentes_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_contribuyentes_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.auditorias_contribuyentes_id_auditoria_seq;
       public          postgres    false    306    4                       0    0 *   auditorias_contribuyentes_id_auditoria_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.auditorias_contribuyentes_id_auditoria_seq OWNED BY public.auditorias_contribuyentes.id_auditoria;
          public          postgres    false    305            ,           1259    75574    auditorias_doc_adjuntos    TABLE     �   CREATE TABLE public.auditorias_doc_adjuntos (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 +   DROP TABLE public.auditorias_doc_adjuntos;
       public         heap    postgres    false    4            +           1259    75573 (   auditorias_doc_adjuntos_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_doc_adjuntos_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.auditorias_doc_adjuntos_id_auditoria_seq;
       public          postgres    false    4    300                       0    0 (   auditorias_doc_adjuntos_id_auditoria_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.auditorias_doc_adjuntos_id_auditoria_seq OWNED BY public.auditorias_doc_adjuntos.id_auditoria;
          public          postgres    false    299            .           1259    75586    auditorias_expedientes    TABLE     �   CREATE TABLE public.auditorias_expedientes (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 *   DROP TABLE public.auditorias_expedientes;
       public         heap    postgres    false    4            -           1259    75585 '   auditorias_expedientes_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_expedientes_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.auditorias_expedientes_id_auditoria_seq;
       public          postgres    false    302    4                       0    0 '   auditorias_expedientes_id_auditoria_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.auditorias_expedientes_id_auditoria_seq OWNED BY public.auditorias_expedientes.id_auditoria;
          public          postgres    false    301            "           1259    74725    auditorias_origen_central    TABLE     �   CREATE TABLE public.auditorias_origen_central (
    id_auditoria integer NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion character varying,
    datos json,
    datos_old json
);
 -   DROP TABLE public.auditorias_origen_central;
       public         heap    postgres    false    4            !           1259    74724    auditorias_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.auditorias_id_auditoria_seq;
       public          postgres    false    290    4                       0    0    auditorias_id_auditoria_seq    SEQUENCE OWNED BY     j   ALTER SEQUENCE public.auditorias_id_auditoria_seq OWNED BY public.auditorias_origen_central.id_auditoria;
          public          postgres    false    289            0           1259    75598    auditorias_infracciones    TABLE     �   CREATE TABLE public.auditorias_infracciones (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 +   DROP TABLE public.auditorias_infracciones;
       public         heap    postgres    false    4            /           1259    75597 (   auditorias_infracciones_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_infracciones_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.auditorias_infracciones_id_auditoria_seq;
       public          postgres    false    4    304                       0    0 (   auditorias_infracciones_id_auditoria_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.auditorias_infracciones_id_auditoria_seq OWNED BY public.auditorias_infracciones.id_auditoria;
          public          postgres    false    303            $           1259    75526    auditorias_tipo_central    TABLE     �   CREATE TABLE public.auditorias_tipo_central (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 +   DROP TABLE public.auditorias_tipo_central;
       public         heap    postgres    false    4            #           1259    75525 (   auditorias_tipo_central_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_tipo_central_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.auditorias_tipo_central_id_auditoria_seq;
       public          postgres    false    292    4                       0    0 (   auditorias_tipo_central_id_auditoria_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.auditorias_tipo_central_id_auditoria_seq OWNED BY public.auditorias_tipo_central.id_auditoria;
          public          postgres    false    291            &           1259    75538    auditorias_ubicacion_central    TABLE     �   CREATE TABLE public.auditorias_ubicacion_central (
    id_auditoria integer NOT NULL,
    fecha_auditada timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 0   DROP TABLE public.auditorias_ubicacion_central;
       public         heap    postgres    false    4            %           1259    75537 -   auditorias_ubicacion_central_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_ubicacion_central_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 D   DROP SEQUENCE public.auditorias_ubicacion_central_id_auditoria_seq;
       public          postgres    false    4    294                       0    0 -   auditorias_ubicacion_central_id_auditoria_seq    SEQUENCE OWNED BY        ALTER SEQUENCE public.auditorias_ubicacion_central_id_auditoria_seq OWNED BY public.auditorias_ubicacion_central.id_auditoria;
          public          postgres    false    293            4           1259    75622    auditorias_vehi_contri    TABLE     �   CREATE TABLE public.auditorias_vehi_contri (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 *   DROP TABLE public.auditorias_vehi_contri;
       public         heap    postgres    false    4            3           1259    75621 '   auditorias_vehi_contri_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_vehi_contri_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.auditorias_vehi_contri_id_auditoria_seq;
       public          postgres    false    308    4                       0    0 '   auditorias_vehi_contri_id_auditoria_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.auditorias_vehi_contri_id_auditoria_seq OWNED BY public.auditorias_vehi_contri.id_auditoria;
          public          postgres    false    307            (           1259    75550    auditorias_vehiculo_central    TABLE     �   CREATE TABLE public.auditorias_vehiculo_central (
    id_auditoria integer NOT NULL,
    fecha_auditoria timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion text,
    datos_new json,
    datos_old json
);
 /   DROP TABLE public.auditorias_vehiculo_central;
       public         heap    postgres    false    4            '           1259    75549 ,   auditorias_vehiculo_central_id_auditoria_seq    SEQUENCE     �   CREATE SEQUENCE public.auditorias_vehiculo_central_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.auditorias_vehiculo_central_id_auditoria_seq;
       public          postgres    false    4    296            	           0    0 ,   auditorias_vehiculo_central_id_auditoria_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.auditorias_vehiculo_central_id_auditoria_seq OWNED BY public.auditorias_vehiculo_central.id_auditoria;
          public          postgres    false    295            �            1259    16572    central    TABLE     �  CREATE TABLE public.central (
    id_reporte integer NOT NULL,
    fecha_ocurrencia timestamp without time zone,
    estado character varying(20),
    fuente_captura character varying(20),
    origen_captura character varying(30),
    clasificacion character varying(20),
    desc_reporte character varying,
    fecha_cierre date,
    otro_recurso character varying,
    id_informante character varying(20),
    id_sector character varying(20),
    id_funcionario character varying,
    direccion character varying,
    coordenadas character varying(255),
    id_tipo_reporte integer,
    id_user_central character varying(5),
    id_origen integer,
    recursos character varying[],
    vehiculo character varying[],
    acompanante character varying[]
);
    DROP TABLE public.central;
       public         heap    postgres    false    4            �            1259    16575    central_id_reporte_seq    SEQUENCE     �   CREATE SEQUENCE public.central_id_reporte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.central_id_reporte_seq;
       public          postgres    false    4    215            
           0    0    central_id_reporte_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.central_id_reporte_seq OWNED BY public.central.id_reporte;
          public          postgres    false    216            �            1259    16890    contribuyentes    TABLE     R  CREATE TABLE public.contribuyentes (
    id_contri integer NOT NULL,
    rut_contri character varying,
    nombre character varying,
    direccion character varying,
    rol_contri character varying,
    giro_contri character varying,
    id_infraccion integer,
    id_expediente character varying,
    sector_contri character varying
);
 "   DROP TABLE public.contribuyentes;
       public         heap    postgres    false    4            �            1259    16889    contribuyentes_id_contri_seq    SEQUENCE     �   CREATE SEQUENCE public.contribuyentes_id_contri_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.contribuyentes_id_contri_seq;
       public          postgres    false    232    4                       0    0    contribuyentes_id_contri_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.contribuyentes_id_contri_seq OWNED BY public.contribuyentes.id_contri;
          public          postgres    false    231            �            1259    17166    danios_y_montos    TABLE     �   CREATE TABLE public.danios_y_montos (
    "id_daños" integer NOT NULL,
    "daños_vivienda" character varying,
    "daños_infra" character varying,
    "daños_personas" jsonb,
    monto_estimado integer,
    "cod_alfa_daños" character varying
);
 #   DROP TABLE public.danios_y_montos;
       public         heap    postgres    false    4            �            1259    17165    danios_y_montos_id_daños_seq    SEQUENCE     �   CREATE SEQUENCE public."danios_y_montos_id_daños_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."danios_y_montos_id_daños_seq";
       public          postgres    false    4    248                       0    0    danios_y_montos_id_daños_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public."danios_y_montos_id_daños_seq" OWNED BY public.danios_y_montos."id_daños";
          public          postgres    false    247                       1259    25364    datos_atencion_procesos    TABLE     R  CREATE TABLE public.datos_atencion_procesos (
    id_atencion_proceso integer NOT NULL,
    fecha_solicitud timestamp without time zone,
    estado_solicitud character varying,
    responsable_solicitud character varying,
    medio_atencion character varying,
    tipo_solicitud character varying,
    temas_atencion character varying
);
 +   DROP TABLE public.datos_atencion_procesos;
       public         heap    postgres    false    4                       1259    25363 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq;
       public          postgres    false    4    270                       0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq OWNED BY public.datos_atencion_procesos.id_atencion_proceso;
          public          postgres    false    269            
           1259    25346    datos_atencion_sector    TABLE        CREATE TABLE public.datos_atencion_sector (
    id_atencion_sector integer NOT NULL,
    direccion_solicitante character varying,
    sector_solicitante character varying,
    poblacion_solicitante character varying,
    junta_vecinos character varying
);
 )   DROP TABLE public.datos_atencion_sector;
       public         heap    postgres    false    4            	           1259    25345 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq;
       public          postgres    false    4    266                       0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq OWNED BY public.datos_atencion_sector.id_atencion_sector;
          public          postgres    false    265                       1259    25355    datos_atencion_solicitud    TABLE       CREATE TABLE public.datos_atencion_solicitud (
    id_atencion_solicitud integer NOT NULL,
    descripcion_solicitud character varying,
    observaciones_solicitud character varying,
    medidas_seguridad character varying,
    espacios_publicos character varying
);
 ,   DROP TABLE public.datos_atencion_solicitud;
       public         heap    postgres    false    4                       1259    25354 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq;
       public          postgres    false    268    4                       0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq OWNED BY public.datos_atencion_solicitud.id_atencion_solicitud;
          public          postgres    false    267                       1259    25337    datos_atencion_usuario    TABLE       CREATE TABLE public.datos_atencion_usuario (
    id_atencion_usuarios integer NOT NULL,
    nombre_solicitante character varying,
    telefono_solicitante character varying,
    correo_solicitante character varying,
    rut_solicitante character varying
);
 *   DROP TABLE public.datos_atencion_usuario;
       public         heap    postgres    false    4                       1259    25336 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq;
       public          postgres    false    264    4                       0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq OWNED BY public.datos_atencion_usuario.id_atencion_usuarios;
          public          postgres    false    263                       1259    25441    datos_origen_informe    TABLE     �  CREATE TABLE public.datos_origen_informe (
    id_origen_informe integer NOT NULL,
    fecha_informe timestamp without time zone,
    captura_informe character varying,
    estado_informe character varying,
    origen_informe json,
    persona_informante json,
    rango_horario character varying,
    fecha_doc_central timestamp without time zone,
    user_creador character varying
);
 (   DROP TABLE public.datos_origen_informe;
       public         heap    postgres    false    4                       1259    25446 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_origen_informe_id_origen_informe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_origen_informe_id_origen_informe_seq;
       public          postgres    false    4    275                       0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_origen_informe_id_origen_informe_seq OWNED BY public.datos_origen_informe.id_origen_informe;
          public          postgres    false    276                        1259    33765    datos_recursos_informe    TABLE     q   CREATE TABLE public.datos_recursos_informe (
    id_recursos integer NOT NULL,
    recursos character varying
);
 *   DROP TABLE public.datos_recursos_informe;
       public         heap    postgres    false    4                       1259    33764 &   datos_recursos_informe_id_recursos_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_recursos_informe_id_recursos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.datos_recursos_informe_id_recursos_seq;
       public          postgres    false    4    288                       0    0 &   datos_recursos_informe_id_recursos_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.datos_recursos_informe_id_recursos_seq OWNED BY public.datos_recursos_informe.id_recursos;
          public          postgres    false    287                       1259    25265    datos_solicitud_denuncia    TABLE     �   CREATE TABLE public.datos_solicitud_denuncia (
    id_denuncia integer NOT NULL,
    entidad character varying,
    num_parte character varying
);
 ,   DROP TABLE public.datos_solicitud_denuncia;
       public         heap    postgres    false    4                       1259    25264 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq;
       public          postgres    false    262    4                       0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq OWNED BY public.datos_solicitud_denuncia.id_denuncia;
          public          postgres    false    261                       1259    25256    datos_solicitud_grabacion    TABLE     M  CREATE TABLE public.datos_solicitud_grabacion (
    id_grabacion integer NOT NULL,
    descripcion_solicitud character varying,
    fecha_siniestro timestamp without time zone,
    direccion_solicitud character varying,
    sector_solicitud character varying,
    camaras character varying,
    estado_solicitud character varying
);
 -   DROP TABLE public.datos_solicitud_grabacion;
       public         heap    postgres    false    4                       1259    25255 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq;
       public          postgres    false    260    4                       0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq OWNED BY public.datos_solicitud_grabacion.id_grabacion;
          public          postgres    false    259                       1259    25247    datos_solicitud_responsable    TABLE     �   CREATE TABLE public.datos_solicitud_responsable (
    id_responsable integer NOT NULL,
    nombre_responsable character varying,
    institucion character varying,
    rut_responsable character varying
);
 /   DROP TABLE public.datos_solicitud_responsable;
       public         heap    postgres    false    4                       1259    25246 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_responsable_id_responsable_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 E   DROP SEQUENCE public.datos_solicitud_responsable_id_responsable_seq;
       public          postgres    false    258    4                       0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_solicitud_responsable_id_responsable_seq OWNED BY public.datos_solicitud_responsable.id_responsable;
          public          postgres    false    257                        1259    25238    datos_solicitud_usuarios    TABLE     /  CREATE TABLE public.datos_solicitud_usuarios (
    id_usuarios_img integer NOT NULL,
    fecha_solicitud timestamp without time zone,
    rut_solicitante character varying,
    nombre_solicitante character varying,
    telefono_solicitante character varying,
    e_mail_solicitante character varying
);
 ,   DROP TABLE public.datos_solicitud_usuarios;
       public         heap    postgres    false    4            �            1259    25237 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq;
       public          postgres    false    256    4                       0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq OWNED BY public.datos_solicitud_usuarios.id_usuarios_img;
          public          postgres    false    255                       1259    25447    datos_tipos_informes    TABLE       CREATE TABLE public.datos_tipos_informes (
    id_tipos_informes integer NOT NULL,
    otro_tipo character varying,
    descripcion_informe character varying,
    tipo_informe json,
    recursos_informe json,
    clasificacion_informe json,
    resolucion_informe character varying
);
 (   DROP TABLE public.datos_tipos_informes;
       public         heap    postgres    false    4                       1259    25452 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq;
       public          postgres    false    4    277                       0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq OWNED BY public.datos_tipos_informes.id_tipos_informes;
          public          postgres    false    278                       1259    25453    datos_ubicacion_informe    TABLE     �   CREATE TABLE public.datos_ubicacion_informe (
    id_ubicacion integer NOT NULL,
    direccion_informe character varying,
    sector_informe json
);
 +   DROP TABLE public.datos_ubicacion_informe;
       public         heap    postgres    false    4                       1259    25458 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq;
       public          postgres    false    4    279                       0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq OWNED BY public.datos_ubicacion_informe.id_ubicacion;
          public          postgres    false    280            �            1259    16977    datos_vehiculos    TABLE     �   CREATE TABLE public.datos_vehiculos (
    id_veh integer NOT NULL,
    tipo character varying,
    marca character varying,
    modelo character varying,
    color character varying
);
 #   DROP TABLE public.datos_vehiculos;
       public         heap    postgres    false    4            �            1259    16976    datos_vehiculos_id_veh_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_vehiculos_id_veh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.datos_vehiculos_id_veh_seq;
       public          postgres    false    240    4                       0    0    datos_vehiculos_id_veh_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.datos_vehiculos_id_veh_seq OWNED BY public.datos_vehiculos.id_veh;
          public          postgres    false    239                       1259    25459    datos_vehiculos_informe    TABLE     �   CREATE TABLE public.datos_vehiculos_informe (
    id_vehiculos integer NOT NULL,
    vehiculos_informe json,
    tripulantes_informe json
);
 +   DROP TABLE public.datos_vehiculos_informe;
       public         heap    postgres    false    4                       1259    25464 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq;
       public          postgres    false    281    4                       0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq OWNED BY public.datos_vehiculos_informe.id_vehiculos;
          public          postgres    false    282            �            1259    16731    doc_adjuntos    TABLE     �   CREATE TABLE public.doc_adjuntos (
    id_adjunto integer NOT NULL,
    path_document character varying,
    id_reporte integer,
    id_expediente character varying,
    id_atencion character varying
);
     DROP TABLE public.doc_adjuntos;
       public         heap    postgres    false    4            �            1259    16730    doc_adjuntos_id_adjunto_seq    SEQUENCE     �   CREATE SEQUENCE public.doc_adjuntos_id_adjunto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.doc_adjuntos_id_adjunto_seq;
       public          postgres    false    4    226                       0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.doc_adjuntos_id_adjunto_seq OWNED BY public.doc_adjuntos.id_adjunto;
          public          postgres    false    225            �            1259    16881    expedientes    TABLE     �  CREATE TABLE public.expedientes (
    id_exp integer NOT NULL,
    id_expediente text NOT NULL,
    fecha_resolucion timestamp without time zone,
    user_creador character varying,
    tipo_procedimiento character varying,
    empadronado character varying,
    testigo character varying,
    id_inspector character varying,
    id_leyes integer,
    id_glosas integer,
    num_control character varying,
    estado_exp character varying,
    fecha_documento timestamp without time zone
);
    DROP TABLE public.expedientes;
       public         heap    postgres    false    4            �            1259    16880    expedientes_id_exp_seq    SEQUENCE     �   CREATE SEQUENCE public.expedientes_id_exp_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.expedientes_id_exp_seq;
       public          postgres    false    230    4                       0    0    expedientes_id_exp_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.expedientes_id_exp_seq OWNED BY public.expedientes.id_exp;
          public          postgres    false    229            �            1259    16637    funcionarios    TABLE     �   CREATE TABLE public.funcionarios (
    id_funcionario character varying(20) NOT NULL,
    funcionario character varying,
    chofer boolean,
    id_vehiculo character varying(5),
    rol_func character varying
);
     DROP TABLE public.funcionarios;
       public         heap    postgres    false    4            �            1259    17073 
   glosas_ley    TABLE     c   CREATE TABLE public.glosas_ley (
    id_glosa integer NOT NULL,
    glosa_ley character varying
);
    DROP TABLE public.glosas_ley;
       public         heap    postgres    false    4            �            1259    17072    glosas_ley_id_glosa_seq    SEQUENCE     �   CREATE SEQUENCE public.glosas_ley_id_glosa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.glosas_ley_id_glosa_seq;
       public          postgres    false    242    4                       0    0    glosas_ley_id_glosa_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.glosas_ley_id_glosa_seq OWNED BY public.glosas_ley.id_glosa;
          public          postgres    false    241            �            1259    16601    informantes    TABLE     �   CREATE TABLE public.informantes (
    id_informante character varying(20) NOT NULL,
    informante character varying(50),
    telefono character varying(15)
);
    DROP TABLE public.informantes;
       public         heap    postgres    false    4            �            1259    17129    informes_alfa    TABLE     �  CREATE TABLE public.informes_alfa (
    id_alfa integer NOT NULL,
    cod_alfa character varying NOT NULL,
    fuente character varying,
    fono character varying,
    sismo_escala character varying,
    tipo_evento character varying[],
    otro_evento character varying,
    descripcion character varying,
    ocurrencia timestamp without time zone,
    acciones character varying,
    oportunidad_tpo character varying,
    recursos_involucrados character varying,
    evaluacion_necesidades character varying,
    capacidad_respuesta integer,
    observaciones character varying,
    usuario_grd character varying,
    fecha_hora timestamp without time zone,
    otras_necesidades character varying
);
 !   DROP TABLE public.informes_alfa;
       public         heap    postgres    false    4            �            1259    17128    informes_alfa_id_alfa_seq    SEQUENCE     �   CREATE SEQUENCE public.informes_alfa_id_alfa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.informes_alfa_id_alfa_seq;
       public          postgres    false    4    244                       0    0    informes_alfa_id_alfa_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.informes_alfa_id_alfa_seq OWNED BY public.informes_alfa.id_alfa;
          public          postgres    false    243                       1259    25506    informes_central    TABLE       CREATE TABLE public.informes_central (
    id_informes_central integer NOT NULL,
    cod_informes_central character varying NOT NULL,
    id_origen_informe integer,
    id_tipos_informe integer,
    id_ubicacion_informe integer,
    id_vehiculo_informe integer
);
 $   DROP TABLE public.informes_central;
       public         heap    postgres    false    4                       1259    25505 (   informes_central_id_informes_central_seq    SEQUENCE     �   CREATE SEQUENCE public.informes_central_id_informes_central_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.informes_central_id_informes_central_seq;
       public          postgres    false    4    284                       0    0 (   informes_central_id_informes_central_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.informes_central_id_informes_central_seq OWNED BY public.informes_central.id_informes_central;
          public          postgres    false    283            �            1259    16899    infracciones    TABLE     U  CREATE TABLE public.infracciones (
    id_infraccion integer NOT NULL,
    sector_infraccion character varying,
    direccion_infraccion character varying,
    fecha_citacion character varying,
    juzgado character varying,
    observaciones character varying,
    fecha_infraccion character varying,
    id_expediente character varying
);
     DROP TABLE public.infracciones;
       public         heap    postgres    false    4            �            1259    16898    infracciones_id_infraccion_seq    SEQUENCE     �   CREATE SEQUENCE public.infracciones_id_infraccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.infracciones_id_infraccion_seq;
       public          postgres    false    4    234                        0    0    infracciones_id_infraccion_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.infracciones_id_infraccion_seq OWNED BY public.infracciones.id_infraccion;
          public          postgres    false    233            �            1259    17239    inventario_grd    TABLE     w  CREATE TABLE public.inventario_grd (
    id_producto integer NOT NULL,
    cod_producto character varying NOT NULL,
    ubicacion character varying,
    observaciones character varying,
    id_productos_grd integer,
    usuario_creador character varying,
    fecha_creado timestamp without time zone,
    prestamo character varying,
    usuario_prestamo character varying
);
 "   DROP TABLE public.inventario_grd;
       public         heap    postgres    false    4            �            1259    17238    inventario_grd_id_producto_seq    SEQUENCE     �   CREATE SEQUENCE public.inventario_grd_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.inventario_grd_id_producto_seq;
       public          postgres    false    250    4            !           0    0    inventario_grd_id_producto_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.inventario_grd_id_producto_seq OWNED BY public.inventario_grd.id_producto;
          public          postgres    false    249            �            1259    16908    leyes    TABLE     V   CREATE TABLE public.leyes (
    id_ley integer NOT NULL,
    ley character varying
);
    DROP TABLE public.leyes;
       public         heap    postgres    false    4            �            1259    16907    leyes_id_ley_seq    SEQUENCE     �   CREATE SEQUENCE public.leyes_id_ley_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.leyes_id_ley_seq;
       public          postgres    false    4    236            "           0    0    leyes_id_ley_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.leyes_id_ley_seq OWNED BY public.leyes.id_ley;
          public          postgres    false    235            �            1259    16757    origenes    TABLE     c   CREATE TABLE public.origenes (
    id_origen integer NOT NULL,
    origen character varying(50)
);
    DROP TABLE public.origenes;
       public         heap    postgres    false    4            �            1259    16756    origenes_id_origen_seq    SEQUENCE     �   CREATE SEQUENCE public.origenes_id_origen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.origenes_id_origen_seq;
       public          postgres    false    228    4            #           0    0    origenes_id_origen_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.origenes_id_origen_seq OWNED BY public.origenes.id_origen;
          public          postgres    false    227            �            1259    17248    productos_grd    TABLE     d  CREATE TABLE public.productos_grd (
    id_productos_grd integer NOT NULL,
    marca character varying,
    modelo character varying,
    serial character varying,
    desc_producto character varying,
    unidad_medida character varying,
    existencias integer,
    cod_producto character varying,
    precio_unitario integer,
    precio_total integer
);
 !   DROP TABLE public.productos_grd;
       public         heap    postgres    false    4            �            1259    17247    productos_grd_id_productos_seq    SEQUENCE     �   CREATE SEQUENCE public.productos_grd_id_productos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.productos_grd_id_productos_seq;
       public          postgres    false    252    4            $           0    0    productos_grd_id_productos_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.productos_grd_id_productos_seq OWNED BY public.productos_grd.id_productos_grd;
          public          postgres    false    251                       1259    25430    reportes_servicios_central    TABLE     V  CREATE TABLE public.reportes_servicios_central (
    id_reporte_service integer NOT NULL,
    cod_reporte_service character varying NOT NULL,
    fecha_reporte timestamp without time zone,
    usuario_reporte character varying,
    vehiculo_reporte character varying,
    tipo_reporte character varying,
    usuario_crea character varying
);
 .   DROP TABLE public.reportes_servicios_central;
       public         heap    postgres    false    4                       1259    25429 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE     �   CREATE SEQUENCE public.reportes_servicios_central_id_reporte_service_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 H   DROP SEQUENCE public.reportes_servicios_central_id_reporte_service_seq;
       public          postgres    false    4    274            %           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.reportes_servicios_central_id_reporte_service_seq OWNED BY public.reportes_servicios_central.id_reporte_service;
          public          postgres    false    273            �            1259    16594    sectores    TABLE     �   CREATE TABLE public.sectores (
    id_sector character varying(20) NOT NULL,
    sector character varying(30),
    coordenada character varying,
    tipo_ubicacion character varying(7)
);
    DROP TABLE public.sectores;
       public         heap    postgres    false    4            �            1259    17151    sectores_alfa    TABLE       CREATE TABLE public.sectores_alfa (
    id_sectores_alfa integer NOT NULL,
    region character varying,
    provincia character varying,
    comuna character varying,
    direccion character varying,
    tipo_ubicacion character varying,
    cod_alfa_sector character varying
);
 !   DROP TABLE public.sectores_alfa;
       public         heap    postgres    false    4            �            1259    17150 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE     �   CREATE SEQUENCE public.sectores_alfa_id_sectores_alfa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.sectores_alfa_id_sectores_alfa_seq;
       public          postgres    false    246    4            &           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.sectores_alfa_id_sectores_alfa_seq OWNED BY public.sectores_alfa.id_sectores_alfa;
          public          postgres    false    245            �            1259    25227    solicitudes_imagenes    TABLE     �   CREATE TABLE public.solicitudes_imagenes (
    id_solicitud integer NOT NULL,
    cod_solicitud character varying NOT NULL,
    id_usuarios_img integer,
    id_responsable integer,
    id_grabacion integer,
    id_denuncia integer
);
 (   DROP TABLE public.solicitudes_imagenes;
       public         heap    postgres    false    4            �            1259    25226 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE     �   CREATE SEQUENCE public.solicitudes_imagenes_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.solicitudes_imagenes_id_solicitud_seq;
       public          postgres    false    254    4            '           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.solicitudes_imagenes_id_solicitud_seq OWNED BY public.solicitudes_imagenes.id_solicitud;
          public          postgres    false    253            �            1259    16701    tipo_reportes    TABLE     �   CREATE TABLE public.tipo_reportes (
    id_tipo integer NOT NULL,
    descripcion character varying(60),
    grupo_reporte character varying(25)
);
 !   DROP TABLE public.tipo_reportes;
       public         heap    postgres    false    4            �            1259    16700    tipo_reportes_id_tipo_seq    SEQUENCE     �   CREATE SEQUENCE public.tipo_reportes_id_tipo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.tipo_reportes_id_tipo_seq;
       public          postgres    false    224    4            (           0    0    tipo_reportes_id_tipo_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.tipo_reportes_id_tipo_seq OWNED BY public.tipo_reportes.id_tipo;
          public          postgres    false    223                       1259    25573    users_system    TABLE     .  CREATE TABLE public.users_system (
    id_user integer NOT NULL,
    cod_user character varying,
    user_name character varying,
    user_password character varying,
    nombre character varying,
    apellido character varying,
    user_rol character varying,
    "resetPassword" character varying
);
     DROP TABLE public.users_system;
       public         heap    postgres    false    4                       1259    25572    users_system_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_system_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.users_system_id_user_seq;
       public          postgres    false    4    286            )           0    0    users_system_id_user_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.users_system_id_user_seq OWNED BY public.users_system.id_user;
          public          postgres    false    285            �            1259    16630 	   vehiculos    TABLE     �   CREATE TABLE public.vehiculos (
    id_vehiculo character varying(5) NOT NULL,
    vehiculo character varying,
    tipo character varying
);
    DROP TABLE public.vehiculos;
       public         heap    postgres    false    4            �            1259    16916    vehiculos_contri    TABLE       CREATE TABLE public.vehiculos_contri (
    tipo_vehi character varying,
    marca_vehi character varying,
    ppu character varying,
    color_vehi character varying,
    id_vehiculos integer NOT NULL,
    id_contri integer,
    id_expediente character varying
);
 $   DROP TABLE public.vehiculos_contri;
       public         heap    postgres    false    4            �            1259    16952    vehiculos_contri_id_v_seq    SEQUENCE     �   CREATE SEQUENCE public.vehiculos_contri_id_v_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.vehiculos_contri_id_v_seq;
       public          postgres    false    4    237            *           0    0    vehiculos_contri_id_v_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.vehiculos_contri_id_v_seq OWNED BY public.vehiculos_contri.id_vehiculos;
          public          postgres    false    238                       2604    25539    acciones cod_accion    DEFAULT     z   ALTER TABLE ONLY public.acciones ALTER COLUMN cod_accion SET DEFAULT nextval('public.acciones_cod_accion_seq'::regclass);
 B   ALTER TABLE public.acciones ALTER COLUMN cod_accion DROP DEFAULT;
       public          postgres    false    218    217    218            8           2604    25540    atencion_ciudadana id_atencion    DEFAULT     �   ALTER TABLE ONLY public.atencion_ciudadana ALTER COLUMN id_atencion SET DEFAULT nextval('public.atencion_ciudadana_id_atencion_seq'::regclass);
 M   ALTER TABLE public.atencion_ciudadana ALTER COLUMN id_atencion DROP DEFAULT;
       public          postgres    false    271    272    272            I           2604    75564     auditorias_acciones id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_acciones ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_acciones_id_auditoria_seq'::regclass);
 O   ALTER TABLE public.auditorias_acciones ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    297    298    298            Q           2604    75613 &   auditorias_contribuyentes id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_contribuyentes ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_contribuyentes_id_auditoria_seq'::regclass);
 U   ALTER TABLE public.auditorias_contribuyentes ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    306    305    306            K           2604    75577 $   auditorias_doc_adjuntos id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_doc_adjuntos ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_doc_adjuntos_id_auditoria_seq'::regclass);
 S   ALTER TABLE public.auditorias_doc_adjuntos ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    299    300    300            M           2604    75589 #   auditorias_expedientes id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_expedientes ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_expedientes_id_auditoria_seq'::regclass);
 R   ALTER TABLE public.auditorias_expedientes ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    302    301    302            O           2604    75601 $   auditorias_infracciones id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_infracciones ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_infracciones_id_auditoria_seq'::regclass);
 S   ALTER TABLE public.auditorias_infracciones ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    304    303    304            A           2604    74728 &   auditorias_origen_central id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_origen_central ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_id_auditoria_seq'::regclass);
 U   ALTER TABLE public.auditorias_origen_central ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    290    289    290            C           2604    75529 $   auditorias_tipo_central id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_tipo_central ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_tipo_central_id_auditoria_seq'::regclass);
 S   ALTER TABLE public.auditorias_tipo_central ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    292    291    292            E           2604    75541 )   auditorias_ubicacion_central id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_ubicacion_central ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_ubicacion_central_id_auditoria_seq'::regclass);
 X   ALTER TABLE public.auditorias_ubicacion_central ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    293    294    294            S           2604    75625 #   auditorias_vehi_contri id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_vehi_contri ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_vehi_contri_id_auditoria_seq'::regclass);
 R   ALTER TABLE public.auditorias_vehi_contri ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    308    307    308            G           2604    75553 (   auditorias_vehiculo_central id_auditoria    DEFAULT     �   ALTER TABLE ONLY public.auditorias_vehiculo_central ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_vehiculo_central_id_auditoria_seq'::regclass);
 W   ALTER TABLE public.auditorias_vehiculo_central ALTER COLUMN id_auditoria DROP DEFAULT;
       public          postgres    false    295    296    296                       2604    25541    central id_reporte    DEFAULT     x   ALTER TABLE ONLY public.central ALTER COLUMN id_reporte SET DEFAULT nextval('public.central_id_reporte_seq'::regclass);
 A   ALTER TABLE public.central ALTER COLUMN id_reporte DROP DEFAULT;
       public          postgres    false    216    215            $           2604    25542    contribuyentes id_contri    DEFAULT     �   ALTER TABLE ONLY public.contribuyentes ALTER COLUMN id_contri SET DEFAULT nextval('public.contribuyentes_id_contri_seq'::regclass);
 G   ALTER TABLE public.contribuyentes ALTER COLUMN id_contri DROP DEFAULT;
       public          postgres    false    232    231    232            ,           2604    25543    danios_y_montos id_daños    DEFAULT     �   ALTER TABLE ONLY public.danios_y_montos ALTER COLUMN "id_daños" SET DEFAULT nextval('public."danios_y_montos_id_daños_seq"'::regclass);
 J   ALTER TABLE public.danios_y_montos ALTER COLUMN "id_daños" DROP DEFAULT;
       public          postgres    false    247    248    248            7           2604    25544 +   datos_atencion_procesos id_atencion_proceso    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso SET DEFAULT nextval('public.datos_atencion_procesos_id_atencion_proceso_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso DROP DEFAULT;
       public          postgres    false    269    270    270            5           2604    25545 (   datos_atencion_sector id_atencion_sector    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_sector ALTER COLUMN id_atencion_sector SET DEFAULT nextval('public.datos_atencion_sector_id_atencion_sector_seq'::regclass);
 W   ALTER TABLE public.datos_atencion_sector ALTER COLUMN id_atencion_sector DROP DEFAULT;
       public          postgres    false    266    265    266            6           2604    25546 .   datos_atencion_solicitud id_atencion_solicitud    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud SET DEFAULT nextval('public.datos_atencion_solicitud_id_atencion_solicitud_seq'::regclass);
 ]   ALTER TABLE public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud DROP DEFAULT;
       public          postgres    false    268    267    268            4           2604    25547 +   datos_atencion_usuario id_atencion_usuarios    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios SET DEFAULT nextval('public.datos_atencion_usuario_id_atencion_usuarios_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios DROP DEFAULT;
       public          postgres    false    263    264    264            :           2604    25548 &   datos_origen_informe id_origen_informe    DEFAULT     �   ALTER TABLE ONLY public.datos_origen_informe ALTER COLUMN id_origen_informe SET DEFAULT nextval('public.datos_origen_informe_id_origen_informe_seq'::regclass);
 U   ALTER TABLE public.datos_origen_informe ALTER COLUMN id_origen_informe DROP DEFAULT;
       public          postgres    false    276    275            @           2604    33768 "   datos_recursos_informe id_recursos    DEFAULT     �   ALTER TABLE ONLY public.datos_recursos_informe ALTER COLUMN id_recursos SET DEFAULT nextval('public.datos_recursos_informe_id_recursos_seq'::regclass);
 Q   ALTER TABLE public.datos_recursos_informe ALTER COLUMN id_recursos DROP DEFAULT;
       public          postgres    false    288    287    288            3           2604    25549 $   datos_solicitud_denuncia id_denuncia    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_denuncia ALTER COLUMN id_denuncia SET DEFAULT nextval('public.datos_solicitud_denuncia_id_denuncia_seq'::regclass);
 S   ALTER TABLE public.datos_solicitud_denuncia ALTER COLUMN id_denuncia DROP DEFAULT;
       public          postgres    false    262    261    262            2           2604    25550 &   datos_solicitud_grabacion id_grabacion    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion ALTER COLUMN id_grabacion SET DEFAULT nextval('public.datos_solicitud_grabacion_id_grabacion_seq'::regclass);
 U   ALTER TABLE public.datos_solicitud_grabacion ALTER COLUMN id_grabacion DROP DEFAULT;
       public          postgres    false    259    260    260            1           2604    25551 *   datos_solicitud_responsable id_responsable    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_responsable ALTER COLUMN id_responsable SET DEFAULT nextval('public.datos_solicitud_responsable_id_responsable_seq'::regclass);
 Y   ALTER TABLE public.datos_solicitud_responsable ALTER COLUMN id_responsable DROP DEFAULT;
       public          postgres    false    258    257    258            0           2604    25552 (   datos_solicitud_usuarios id_usuarios_img    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img SET DEFAULT nextval('public.datos_solicitud_usuarios_id_usuarios_seq'::regclass);
 W   ALTER TABLE public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img DROP DEFAULT;
       public          postgres    false    256    255    256            ;           2604    25553 &   datos_tipos_informes id_tipos_informes    DEFAULT     �   ALTER TABLE ONLY public.datos_tipos_informes ALTER COLUMN id_tipos_informes SET DEFAULT nextval('public.datos_tipos_informes_id_tipos_informes_seq'::regclass);
 U   ALTER TABLE public.datos_tipos_informes ALTER COLUMN id_tipos_informes DROP DEFAULT;
       public          postgres    false    278    277            <           2604    25554 $   datos_ubicacion_informe id_ubicacion    DEFAULT     �   ALTER TABLE ONLY public.datos_ubicacion_informe ALTER COLUMN id_ubicacion SET DEFAULT nextval('public.datos_ubicacion_informe_id_ubicacion_seq'::regclass);
 S   ALTER TABLE public.datos_ubicacion_informe ALTER COLUMN id_ubicacion DROP DEFAULT;
       public          postgres    false    280    279            (           2604    25555    datos_vehiculos id_veh    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos ALTER COLUMN id_veh SET DEFAULT nextval('public.datos_vehiculos_id_veh_seq'::regclass);
 E   ALTER TABLE public.datos_vehiculos ALTER COLUMN id_veh DROP DEFAULT;
       public          postgres    false    240    239    240            =           2604    25556 $   datos_vehiculos_informe id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos_informe ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.datos_vehiculos_informe_id_vehiculos_seq'::regclass);
 S   ALTER TABLE public.datos_vehiculos_informe ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    282    281            !           2604    25557    doc_adjuntos id_adjunto    DEFAULT     �   ALTER TABLE ONLY public.doc_adjuntos ALTER COLUMN id_adjunto SET DEFAULT nextval('public.doc_adjuntos_id_adjunto_seq'::regclass);
 F   ALTER TABLE public.doc_adjuntos ALTER COLUMN id_adjunto DROP DEFAULT;
       public          postgres    false    226    225    226            #           2604    25558    expedientes id_exp    DEFAULT     x   ALTER TABLE ONLY public.expedientes ALTER COLUMN id_exp SET DEFAULT nextval('public.expedientes_id_exp_seq'::regclass);
 A   ALTER TABLE public.expedientes ALTER COLUMN id_exp DROP DEFAULT;
       public          postgres    false    230    229    230            )           2604    25559    glosas_ley id_glosa    DEFAULT     z   ALTER TABLE ONLY public.glosas_ley ALTER COLUMN id_glosa SET DEFAULT nextval('public.glosas_ley_id_glosa_seq'::regclass);
 B   ALTER TABLE public.glosas_ley ALTER COLUMN id_glosa DROP DEFAULT;
       public          postgres    false    241    242    242            *           2604    25560    informes_alfa id_alfa    DEFAULT     ~   ALTER TABLE ONLY public.informes_alfa ALTER COLUMN id_alfa SET DEFAULT nextval('public.informes_alfa_id_alfa_seq'::regclass);
 D   ALTER TABLE public.informes_alfa ALTER COLUMN id_alfa DROP DEFAULT;
       public          postgres    false    243    244    244            >           2604    25561 $   informes_central id_informes_central    DEFAULT     �   ALTER TABLE ONLY public.informes_central ALTER COLUMN id_informes_central SET DEFAULT nextval('public.informes_central_id_informes_central_seq'::regclass);
 S   ALTER TABLE public.informes_central ALTER COLUMN id_informes_central DROP DEFAULT;
       public          postgres    false    283    284    284            %           2604    25562    infracciones id_infraccion    DEFAULT     �   ALTER TABLE ONLY public.infracciones ALTER COLUMN id_infraccion SET DEFAULT nextval('public.infracciones_id_infraccion_seq'::regclass);
 I   ALTER TABLE public.infracciones ALTER COLUMN id_infraccion DROP DEFAULT;
       public          postgres    false    233    234    234            -           2604    25563    inventario_grd id_producto    DEFAULT     �   ALTER TABLE ONLY public.inventario_grd ALTER COLUMN id_producto SET DEFAULT nextval('public.inventario_grd_id_producto_seq'::regclass);
 I   ALTER TABLE public.inventario_grd ALTER COLUMN id_producto DROP DEFAULT;
       public          postgres    false    250    249    250            &           2604    25564    leyes id_ley    DEFAULT     l   ALTER TABLE ONLY public.leyes ALTER COLUMN id_ley SET DEFAULT nextval('public.leyes_id_ley_seq'::regclass);
 ;   ALTER TABLE public.leyes ALTER COLUMN id_ley DROP DEFAULT;
       public          postgres    false    235    236    236            "           2604    25565    origenes id_origen    DEFAULT     x   ALTER TABLE ONLY public.origenes ALTER COLUMN id_origen SET DEFAULT nextval('public.origenes_id_origen_seq'::regclass);
 A   ALTER TABLE public.origenes ALTER COLUMN id_origen DROP DEFAULT;
       public          postgres    false    227    228    228            .           2604    25566    productos_grd id_productos_grd    DEFAULT     �   ALTER TABLE ONLY public.productos_grd ALTER COLUMN id_productos_grd SET DEFAULT nextval('public.productos_grd_id_productos_seq'::regclass);
 M   ALTER TABLE public.productos_grd ALTER COLUMN id_productos_grd DROP DEFAULT;
       public          postgres    false    251    252    252            9           2604    25567 -   reportes_servicios_central id_reporte_service    DEFAULT     �   ALTER TABLE ONLY public.reportes_servicios_central ALTER COLUMN id_reporte_service SET DEFAULT nextval('public.reportes_servicios_central_id_reporte_service_seq'::regclass);
 \   ALTER TABLE public.reportes_servicios_central ALTER COLUMN id_reporte_service DROP DEFAULT;
       public          postgres    false    273    274    274            +           2604    25568    sectores_alfa id_sectores_alfa    DEFAULT     �   ALTER TABLE ONLY public.sectores_alfa ALTER COLUMN id_sectores_alfa SET DEFAULT nextval('public.sectores_alfa_id_sectores_alfa_seq'::regclass);
 M   ALTER TABLE public.sectores_alfa ALTER COLUMN id_sectores_alfa DROP DEFAULT;
       public          postgres    false    246    245    246            /           2604    25569 !   solicitudes_imagenes id_solicitud    DEFAULT     �   ALTER TABLE ONLY public.solicitudes_imagenes ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitudes_imagenes_id_solicitud_seq'::regclass);
 P   ALTER TABLE public.solicitudes_imagenes ALTER COLUMN id_solicitud DROP DEFAULT;
       public          postgres    false    253    254    254                        2604    25570    tipo_reportes id_tipo    DEFAULT     ~   ALTER TABLE ONLY public.tipo_reportes ALTER COLUMN id_tipo SET DEFAULT nextval('public.tipo_reportes_id_tipo_seq'::regclass);
 D   ALTER TABLE public.tipo_reportes ALTER COLUMN id_tipo DROP DEFAULT;
       public          postgres    false    223    224    224            ?           2604    25576    users_system id_user    DEFAULT     |   ALTER TABLE ONLY public.users_system ALTER COLUMN id_user SET DEFAULT nextval('public.users_system_id_user_seq'::regclass);
 C   ALTER TABLE public.users_system ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    286    285    286            '           2604    25571    vehiculos_contri id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.vehiculos_contri ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.vehiculos_contri_id_v_seq'::regclass);
 L   ALTER TABLE public.vehiculos_contri ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    238    237            �          0    16585    acciones 
   TABLE DATA           z   COPY public.acciones (cod_accion, fecha_accion, desc_acciones, estado_accion, fecha_resolucion, cod_document) FROM stdin;
    public          postgres    false    218   �i      �          0    25373    atencion_ciudadana 
   TABLE DATA           �   COPY public.atencion_ciudadana (id_atencion, cod_atencion, id_atencion_usuario, id_atencion_sector, id_atencion_solicitud, id_atencion_proceso) FROM stdin;
    public          postgres    false    272   �j      �          0    75561    auditorias_acciones 
   TABLE DATA           j   COPY public.auditorias_acciones (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    298   Yk      �          0    75610    auditorias_contribuyentes 
   TABLE DATA           p   COPY public.auditorias_contribuyentes (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    306   ll      �          0    75574    auditorias_doc_adjuntos 
   TABLE DATA           n   COPY public.auditorias_doc_adjuntos (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    300   �m      �          0    75586    auditorias_expedientes 
   TABLE DATA           m   COPY public.auditorias_expedientes (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    302   �o      �          0    75598    auditorias_infracciones 
   TABLE DATA           n   COPY public.auditorias_infracciones (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    304   �q      �          0    74725    auditorias_origen_central 
   TABLE DATA           g   COPY public.auditorias_origen_central (id_auditoria, fecha_hora, accion, datos, datos_old) FROM stdin;
    public          postgres    false    290   �s      �          0    75526    auditorias_tipo_central 
   TABLE DATA           n   COPY public.auditorias_tipo_central (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    292   �u      �          0    75538    auditorias_ubicacion_central 
   TABLE DATA           r   COPY public.auditorias_ubicacion_central (id_auditoria, fecha_auditada, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    294   �w      �          0    75622    auditorias_vehi_contri 
   TABLE DATA           m   COPY public.auditorias_vehi_contri (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    308   "y      �          0    75550    auditorias_vehiculo_central 
   TABLE DATA           r   COPY public.auditorias_vehiculo_central (id_auditoria, fecha_auditoria, accion, datos_new, datos_old) FROM stdin;
    public          postgres    false    296   z      �          0    16572    central 
   TABLE DATA           0  COPY public.central (id_reporte, fecha_ocurrencia, estado, fuente_captura, origen_captura, clasificacion, desc_reporte, fecha_cierre, otro_recurso, id_informante, id_sector, id_funcionario, direccion, coordenadas, id_tipo_reporte, id_user_central, id_origen, recursos, vehiculo, acompanante) FROM stdin;
    public          postgres    false    215   �{      �          0    16890    contribuyentes 
   TABLE DATA           �   COPY public.contribuyentes (id_contri, rut_contri, nombre, direccion, rol_contri, giro_contri, id_infraccion, id_expediente, sector_contri) FROM stdin;
    public          postgres    false    232   �      �          0    17166    danios_y_montos 
   TABLE DATA           �   COPY public.danios_y_montos ("id_daños", "daños_vivienda", "daños_infra", "daños_personas", monto_estimado, "cod_alfa_daños") FROM stdin;
    public          postgres    false    248   &�      �          0    25364    datos_atencion_procesos 
   TABLE DATA           �   COPY public.datos_atencion_procesos (id_atencion_proceso, fecha_solicitud, estado_solicitud, responsable_solicitud, medio_atencion, tipo_solicitud, temas_atencion) FROM stdin;
    public          postgres    false    270   ��      �          0    25346    datos_atencion_sector 
   TABLE DATA           �   COPY public.datos_atencion_sector (id_atencion_sector, direccion_solicitante, sector_solicitante, poblacion_solicitante, junta_vecinos) FROM stdin;
    public          postgres    false    266   x�      �          0    25355    datos_atencion_solicitud 
   TABLE DATA           �   COPY public.datos_atencion_solicitud (id_atencion_solicitud, descripcion_solicitud, observaciones_solicitud, medidas_seguridad, espacios_publicos) FROM stdin;
    public          postgres    false    268   ��      �          0    25337    datos_atencion_usuario 
   TABLE DATA           �   COPY public.datos_atencion_usuario (id_atencion_usuarios, nombre_solicitante, telefono_solicitante, correo_solicitante, rut_solicitante) FROM stdin;
    public          postgres    false    264   ��      �          0    25441    datos_origen_informe 
   TABLE DATA           �   COPY public.datos_origen_informe (id_origen_informe, fecha_informe, captura_informe, estado_informe, origen_informe, persona_informante, rango_horario, fecha_doc_central, user_creador) FROM stdin;
    public          postgres    false    275   \�      �          0    33765    datos_recursos_informe 
   TABLE DATA           G   COPY public.datos_recursos_informe (id_recursos, recursos) FROM stdin;
    public          postgres    false    288   �      �          0    25265    datos_solicitud_denuncia 
   TABLE DATA           S   COPY public.datos_solicitud_denuncia (id_denuncia, entidad, num_parte) FROM stdin;
    public          postgres    false    262   D�      �          0    25256    datos_solicitud_grabacion 
   TABLE DATA           �   COPY public.datos_solicitud_grabacion (id_grabacion, descripcion_solicitud, fecha_siniestro, direccion_solicitud, sector_solicitud, camaras, estado_solicitud) FROM stdin;
    public          postgres    false    260   m�      �          0    25247    datos_solicitud_responsable 
   TABLE DATA           w   COPY public.datos_solicitud_responsable (id_responsable, nombre_responsable, institucion, rut_responsable) FROM stdin;
    public          postgres    false    258   ��      �          0    25238    datos_solicitud_usuarios 
   TABLE DATA           �   COPY public.datos_solicitud_usuarios (id_usuarios_img, fecha_solicitud, rut_solicitante, nombre_solicitante, telefono_solicitante, e_mail_solicitante) FROM stdin;
    public          postgres    false    256   ��      �          0    25447    datos_tipos_informes 
   TABLE DATA           �   COPY public.datos_tipos_informes (id_tipos_informes, otro_tipo, descripcion_informe, tipo_informe, recursos_informe, clasificacion_informe, resolucion_informe) FROM stdin;
    public          postgres    false    277   �      �          0    25453    datos_ubicacion_informe 
   TABLE DATA           b   COPY public.datos_ubicacion_informe (id_ubicacion, direccion_informe, sector_informe) FROM stdin;
    public          postgres    false    279   1�      �          0    16977    datos_vehiculos 
   TABLE DATA           M   COPY public.datos_vehiculos (id_veh, tipo, marca, modelo, color) FROM stdin;
    public          postgres    false    240   .�      �          0    25459    datos_vehiculos_informe 
   TABLE DATA           g   COPY public.datos_vehiculos_informe (id_vehiculos, vehiculos_informe, tripulantes_informe) FROM stdin;
    public          postgres    false    281   ��      �          0    16731    doc_adjuntos 
   TABLE DATA           i   COPY public.doc_adjuntos (id_adjunto, path_document, id_reporte, id_expediente, id_atencion) FROM stdin;
    public          postgres    false    226   �      �          0    16881    expedientes 
   TABLE DATA           �   COPY public.expedientes (id_exp, id_expediente, fecha_resolucion, user_creador, tipo_procedimiento, empadronado, testigo, id_inspector, id_leyes, id_glosas, num_control, estado_exp, fecha_documento) FROM stdin;
    public          postgres    false    230   Ǡ      �          0    16637    funcionarios 
   TABLE DATA           b   COPY public.funcionarios (id_funcionario, funcionario, chofer, id_vehiculo, rol_func) FROM stdin;
    public          postgres    false    222   F�      �          0    17073 
   glosas_ley 
   TABLE DATA           9   COPY public.glosas_ley (id_glosa, glosa_ley) FROM stdin;
    public          postgres    false    242   Υ      �          0    16601    informantes 
   TABLE DATA           J   COPY public.informantes (id_informante, informante, telefono) FROM stdin;
    public          postgres    false    220   �      �          0    17129    informes_alfa 
   TABLE DATA           #  COPY public.informes_alfa (id_alfa, cod_alfa, fuente, fono, sismo_escala, tipo_evento, otro_evento, descripcion, ocurrencia, acciones, oportunidad_tpo, recursos_involucrados, evaluacion_necesidades, capacidad_respuesta, observaciones, usuario_grd, fecha_hora, otras_necesidades) FROM stdin;
    public          postgres    false    244   \�      �          0    25506    informes_central 
   TABLE DATA           �   COPY public.informes_central (id_informes_central, cod_informes_central, id_origen_informe, id_tipos_informe, id_ubicacion_informe, id_vehiculo_informe) FROM stdin;
    public          postgres    false    284   �      �          0    16899    infracciones 
   TABLE DATA           �   COPY public.infracciones (id_infraccion, sector_infraccion, direccion_infraccion, fecha_citacion, juzgado, observaciones, fecha_infraccion, id_expediente) FROM stdin;
    public          postgres    false    234   �      �          0    17239    inventario_grd 
   TABLE DATA           �   COPY public.inventario_grd (id_producto, cod_producto, ubicacion, observaciones, id_productos_grd, usuario_creador, fecha_creado, prestamo, usuario_prestamo) FROM stdin;
    public          postgres    false    250   ��      �          0    16908    leyes 
   TABLE DATA           ,   COPY public.leyes (id_ley, ley) FROM stdin;
    public          postgres    false    236   ��      �          0    16757    origenes 
   TABLE DATA           5   COPY public.origenes (id_origen, origen) FROM stdin;
    public          postgres    false    228   )�      �          0    17248    productos_grd 
   TABLE DATA           �   COPY public.productos_grd (id_productos_grd, marca, modelo, serial, desc_producto, unidad_medida, existencias, cod_producto, precio_unitario, precio_total) FROM stdin;
    public          postgres    false    252   =�      �          0    25430    reportes_servicios_central 
   TABLE DATA           �   COPY public.reportes_servicios_central (id_reporte_service, cod_reporte_service, fecha_reporte, usuario_reporte, vehiculo_reporte, tipo_reporte, usuario_crea) FROM stdin;
    public          postgres    false    274   ��      �          0    16594    sectores 
   TABLE DATA           Q   COPY public.sectores (id_sector, sector, coordenada, tipo_ubicacion) FROM stdin;
    public          postgres    false    219   �      �          0    17151    sectores_alfa 
   TABLE DATA           �   COPY public.sectores_alfa (id_sectores_alfa, region, provincia, comuna, direccion, tipo_ubicacion, cod_alfa_sector) FROM stdin;
    public          postgres    false    246   T�      �          0    25227    solicitudes_imagenes 
   TABLE DATA           �   COPY public.solicitudes_imagenes (id_solicitud, cod_solicitud, id_usuarios_img, id_responsable, id_grabacion, id_denuncia) FROM stdin;
    public          postgres    false    254   ��      �          0    16701    tipo_reportes 
   TABLE DATA           L   COPY public.tipo_reportes (id_tipo, descripcion, grupo_reporte) FROM stdin;
    public          postgres    false    224   A�      �          0    25573    users_system 
   TABLE DATA           �   COPY public.users_system (id_user, cod_user, user_name, user_password, nombre, apellido, user_rol, "resetPassword") FROM stdin;
    public          postgres    false    286   �      �          0    16630 	   vehiculos 
   TABLE DATA           @   COPY public.vehiculos (id_vehiculo, vehiculo, tipo) FROM stdin;
    public          postgres    false    221   �      �          0    16916    vehiculos_contri 
   TABLE DATA           z   COPY public.vehiculos_contri (tipo_vehi, marca_vehi, ppu, color_vehi, id_vehiculos, id_contri, id_expediente) FROM stdin;
    public          postgres    false    237   �      +           0    0    acciones_cod_accion_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.acciones_cod_accion_seq', 87, true);
          public          postgres    false    217            ,           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.atencion_ciudadana_id_atencion_seq', 17, true);
          public          postgres    false    271            -           0    0 $   auditorias_acciones_id_auditoria_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.auditorias_acciones_id_auditoria_seq', 4, true);
          public          postgres    false    297            .           0    0 *   auditorias_contribuyentes_id_auditoria_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.auditorias_contribuyentes_id_auditoria_seq', 7, true);
          public          postgres    false    305            /           0    0 (   auditorias_doc_adjuntos_id_auditoria_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.auditorias_doc_adjuntos_id_auditoria_seq', 11, true);
          public          postgres    false    299            0           0    0 '   auditorias_expedientes_id_auditoria_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.auditorias_expedientes_id_auditoria_seq', 8, true);
          public          postgres    false    301            1           0    0    auditorias_id_auditoria_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.auditorias_id_auditoria_seq', 11, true);
          public          postgres    false    289            2           0    0 (   auditorias_infracciones_id_auditoria_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.auditorias_infracciones_id_auditoria_seq', 7, true);
          public          postgres    false    303            3           0    0 (   auditorias_tipo_central_id_auditoria_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.auditorias_tipo_central_id_auditoria_seq', 9, true);
          public          postgres    false    291            4           0    0 -   auditorias_ubicacion_central_id_auditoria_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.auditorias_ubicacion_central_id_auditoria_seq', 9, true);
          public          postgres    false    293            5           0    0 '   auditorias_vehi_contri_id_auditoria_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.auditorias_vehi_contri_id_auditoria_seq', 7, true);
          public          postgres    false    307            6           0    0 ,   auditorias_vehiculo_central_id_auditoria_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.auditorias_vehiculo_central_id_auditoria_seq', 7, true);
          public          postgres    false    295            7           0    0    central_id_reporte_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.central_id_reporte_seq', 277, true);
          public          postgres    false    216            8           0    0    contribuyentes_id_contri_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.contribuyentes_id_contri_seq', 75, true);
          public          postgres    false    231            9           0    0    danios_y_montos_id_daños_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."danios_y_montos_id_daños_seq"', 30, true);
          public          postgres    false    247            :           0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_procesos_id_atencion_proceso_seq', 19, true);
          public          postgres    false    269            ;           0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.datos_atencion_sector_id_atencion_sector_seq', 20, true);
          public          postgres    false    265            <           0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.datos_atencion_solicitud_id_atencion_solicitud_seq', 19, true);
          public          postgres    false    267            =           0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_usuario_id_atencion_usuarios_seq', 22, true);
          public          postgres    false    263            >           0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.datos_origen_informe_id_origen_informe_seq', 100, true);
          public          postgres    false    276            ?           0    0 &   datos_recursos_informe_id_recursos_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.datos_recursos_informe_id_recursos_seq', 2, true);
          public          postgres    false    287            @           0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_denuncia_id_denuncia_seq', 48, true);
          public          postgres    false    261            A           0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_solicitud_grabacion_id_grabacion_seq', 39, true);
          public          postgres    false    259            B           0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('public.datos_solicitud_responsable_id_responsable_seq', 39, true);
          public          postgres    false    257            C           0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_usuarios_id_usuarios_seq', 55, true);
          public          postgres    false    255            D           0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.datos_tipos_informes_id_tipos_informes_seq', 115, true);
          public          postgres    false    278            E           0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_ubicacion_informe_id_ubicacion_seq', 75, true);
          public          postgres    false    280            F           0    0    datos_vehiculos_id_veh_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.datos_vehiculos_id_veh_seq', 5, true);
          public          postgres    false    239            G           0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_vehiculos_informe_id_vehiculos_seq', 70, true);
          public          postgres    false    282            H           0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.doc_adjuntos_id_adjunto_seq', 141, true);
          public          postgres    false    225            I           0    0    expedientes_id_exp_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.expedientes_id_exp_seq', 148, true);
          public          postgres    false    229            J           0    0    glosas_ley_id_glosa_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.glosas_ley_id_glosa_seq', 4, true);
          public          postgres    false    241            K           0    0    informes_alfa_id_alfa_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.informes_alfa_id_alfa_seq', 43, true);
          public          postgres    false    243            L           0    0 (   informes_central_id_informes_central_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.informes_central_id_informes_central_seq', 59, true);
          public          postgres    false    283            M           0    0    infracciones_id_infraccion_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.infracciones_id_infraccion_seq', 87, true);
          public          postgres    false    233            N           0    0    inventario_grd_id_producto_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.inventario_grd_id_producto_seq', 75, true);
          public          postgres    false    249            O           0    0    leyes_id_ley_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.leyes_id_ley_seq', 4, true);
          public          postgres    false    235            P           0    0    origenes_id_origen_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.origenes_id_origen_seq', 19, true);
          public          postgres    false    227            Q           0    0    productos_grd_id_productos_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.productos_grd_id_productos_seq', 69, true);
          public          postgres    false    251            R           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.reportes_servicios_central_id_reporte_service_seq', 5, true);
          public          postgres    false    273            S           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.sectores_alfa_id_sectores_alfa_seq', 27, true);
          public          postgres    false    245            T           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.solicitudes_imagenes_id_solicitud_seq', 50, true);
          public          postgres    false    253            U           0    0    tipo_reportes_id_tipo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tipo_reportes_id_tipo_seq', 152, true);
          public          postgres    false    223            V           0    0    users_system_id_user_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.users_system_id_user_seq', 14, true);
          public          postgres    false    285            W           0    0    vehiculos_contri_id_v_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.vehiculos_contri_id_v_seq', 76, true);
          public          postgres    false    238            �           2606    25415 *   atencion_ciudadana atencion_ciudadana_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT atencion_ciudadana_pkey PRIMARY KEY (cod_atencion);
 T   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT atencion_ciudadana_pkey;
       public            postgres    false    272            �           2606    75569 ,   auditorias_acciones auditorias_acciones_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.auditorias_acciones
    ADD CONSTRAINT auditorias_acciones_pkey PRIMARY KEY (id_auditoria);
 V   ALTER TABLE ONLY public.auditorias_acciones DROP CONSTRAINT auditorias_acciones_pkey;
       public            postgres    false    298            �           2606    75618 8   auditorias_contribuyentes auditorias_contribuyentes_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.auditorias_contribuyentes
    ADD CONSTRAINT auditorias_contribuyentes_pkey PRIMARY KEY (id_auditoria);
 b   ALTER TABLE ONLY public.auditorias_contribuyentes DROP CONSTRAINT auditorias_contribuyentes_pkey;
       public            postgres    false    306            �           2606    75582 4   auditorias_doc_adjuntos auditorias_doc_adjuntos_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.auditorias_doc_adjuntos
    ADD CONSTRAINT auditorias_doc_adjuntos_pkey PRIMARY KEY (id_auditoria);
 ^   ALTER TABLE ONLY public.auditorias_doc_adjuntos DROP CONSTRAINT auditorias_doc_adjuntos_pkey;
       public            postgres    false    300            �           2606    75594 2   auditorias_expedientes auditorias_expedientes_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.auditorias_expedientes
    ADD CONSTRAINT auditorias_expedientes_pkey PRIMARY KEY (id_auditoria);
 \   ALTER TABLE ONLY public.auditorias_expedientes DROP CONSTRAINT auditorias_expedientes_pkey;
       public            postgres    false    302            �           2606    75606 4   auditorias_infracciones auditorias_infracciones_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.auditorias_infracciones
    ADD CONSTRAINT auditorias_infracciones_pkey PRIMARY KEY (id_auditoria);
 ^   ALTER TABLE ONLY public.auditorias_infracciones DROP CONSTRAINT auditorias_infracciones_pkey;
       public            postgres    false    304            �           2606    74732 )   auditorias_origen_central auditorias_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.auditorias_origen_central
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id_auditoria);
 S   ALTER TABLE ONLY public.auditorias_origen_central DROP CONSTRAINT auditorias_pkey;
       public            postgres    false    290            �           2606    75534 4   auditorias_tipo_central auditorias_tipo_central_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.auditorias_tipo_central
    ADD CONSTRAINT auditorias_tipo_central_pkey PRIMARY KEY (id_auditoria);
 ^   ALTER TABLE ONLY public.auditorias_tipo_central DROP CONSTRAINT auditorias_tipo_central_pkey;
       public            postgres    false    292            �           2606    75546 >   auditorias_ubicacion_central auditorias_ubicacion_central_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.auditorias_ubicacion_central
    ADD CONSTRAINT auditorias_ubicacion_central_pkey PRIMARY KEY (id_auditoria);
 h   ALTER TABLE ONLY public.auditorias_ubicacion_central DROP CONSTRAINT auditorias_ubicacion_central_pkey;
       public            postgres    false    294            �           2606    75630 2   auditorias_vehi_contri auditorias_vehi_contri_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.auditorias_vehi_contri
    ADD CONSTRAINT auditorias_vehi_contri_pkey PRIMARY KEY (id_auditoria);
 \   ALTER TABLE ONLY public.auditorias_vehi_contri DROP CONSTRAINT auditorias_vehi_contri_pkey;
       public            postgres    false    308            �           2606    75558 <   auditorias_vehiculo_central auditorias_vehiculo_central_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.auditorias_vehiculo_central
    ADD CONSTRAINT auditorias_vehiculo_central_pkey PRIMARY KEY (id_auditoria);
 f   ALTER TABLE ONLY public.auditorias_vehiculo_central DROP CONSTRAINT auditorias_vehiculo_central_pkey;
       public            postgres    false    296            v           2606    17020 "   contribuyentes contribuyentes_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT contribuyentes_pkey PRIMARY KEY (id_contri);
 L   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT contribuyentes_pkey;
       public            postgres    false    232            �           2606    17173 $   danios_y_montos danios_y_montos_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT danios_y_montos_pkey PRIMARY KEY ("id_daños");
 N   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT danios_y_montos_pkey;
       public            postgres    false    248            �           2606    25371 4   datos_atencion_procesos datos_atencion_procesos_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_procesos
    ADD CONSTRAINT datos_atencion_procesos_pkey PRIMARY KEY (id_atencion_proceso);
 ^   ALTER TABLE ONLY public.datos_atencion_procesos DROP CONSTRAINT datos_atencion_procesos_pkey;
       public            postgres    false    270            �           2606    25353 0   datos_atencion_sector datos_atencion_sector_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.datos_atencion_sector
    ADD CONSTRAINT datos_atencion_sector_pkey PRIMARY KEY (id_atencion_sector);
 Z   ALTER TABLE ONLY public.datos_atencion_sector DROP CONSTRAINT datos_atencion_sector_pkey;
       public            postgres    false    266            �           2606    25362 6   datos_atencion_solicitud datos_atencion_solicitud_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_solicitud
    ADD CONSTRAINT datos_atencion_solicitud_pkey PRIMARY KEY (id_atencion_solicitud);
 `   ALTER TABLE ONLY public.datos_atencion_solicitud DROP CONSTRAINT datos_atencion_solicitud_pkey;
       public            postgres    false    268            �           2606    25344 2   datos_atencion_usuario datos_atencion_usuario_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_usuario
    ADD CONSTRAINT datos_atencion_usuario_pkey PRIMARY KEY (id_atencion_usuarios);
 \   ALTER TABLE ONLY public.datos_atencion_usuario DROP CONSTRAINT datos_atencion_usuario_pkey;
       public            postgres    false    264            �           2606    25498 .   datos_origen_informe datos_origen_informe_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_origen_informe
    ADD CONSTRAINT datos_origen_informe_pkey PRIMARY KEY (id_origen_informe);
 X   ALTER TABLE ONLY public.datos_origen_informe DROP CONSTRAINT datos_origen_informe_pkey;
       public            postgres    false    275            �           2606    33772 2   datos_recursos_informe datos_recursos_informe_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public.datos_recursos_informe
    ADD CONSTRAINT datos_recursos_informe_pkey PRIMARY KEY (id_recursos);
 \   ALTER TABLE ONLY public.datos_recursos_informe DROP CONSTRAINT datos_recursos_informe_pkey;
       public            postgres    false    288            �           2606    25272 6   datos_solicitud_denuncia datos_solicitud_denuncia_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.datos_solicitud_denuncia
    ADD CONSTRAINT datos_solicitud_denuncia_pkey PRIMARY KEY (id_denuncia);
 `   ALTER TABLE ONLY public.datos_solicitud_denuncia DROP CONSTRAINT datos_solicitud_denuncia_pkey;
       public            postgres    false    262            �           2606    25263 8   datos_solicitud_grabacion datos_solicitud_grabacion_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion
    ADD CONSTRAINT datos_solicitud_grabacion_pkey PRIMARY KEY (id_grabacion);
 b   ALTER TABLE ONLY public.datos_solicitud_grabacion DROP CONSTRAINT datos_solicitud_grabacion_pkey;
       public            postgres    false    260            �           2606    25254 <   datos_solicitud_responsable datos_solicitud_responsable_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_responsable
    ADD CONSTRAINT datos_solicitud_responsable_pkey PRIMARY KEY (id_responsable);
 f   ALTER TABLE ONLY public.datos_solicitud_responsable DROP CONSTRAINT datos_solicitud_responsable_pkey;
       public            postgres    false    258            �           2606    25245 6   datos_solicitud_usuarios datos_solicitud_usuarios_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios
    ADD CONSTRAINT datos_solicitud_usuarios_pkey PRIMARY KEY (id_usuarios_img);
 `   ALTER TABLE ONLY public.datos_solicitud_usuarios DROP CONSTRAINT datos_solicitud_usuarios_pkey;
       public            postgres    false    256            �           2606    25500 .   datos_tipos_informes datos_tipos_informes_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_tipos_informes
    ADD CONSTRAINT datos_tipos_informes_pkey PRIMARY KEY (id_tipos_informes);
 X   ALTER TABLE ONLY public.datos_tipos_informes DROP CONSTRAINT datos_tipos_informes_pkey;
       public            postgres    false    277            �           2606    25502 4   datos_ubicacion_informe datos_ubicacion_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_ubicacion_informe
    ADD CONSTRAINT datos_ubicacion_informe_pkey PRIMARY KEY (id_ubicacion);
 ^   ALTER TABLE ONLY public.datos_ubicacion_informe DROP CONSTRAINT datos_ubicacion_informe_pkey;
       public            postgres    false    279            �           2606    25504 4   datos_vehiculos_informe datos_vehiculos_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_vehiculos_informe
    ADD CONSTRAINT datos_vehiculos_informe_pkey PRIMARY KEY (id_vehiculos);
 ^   ALTER TABLE ONLY public.datos_vehiculos_informe DROP CONSTRAINT datos_vehiculos_informe_pkey;
       public            postgres    false    281            �           2606    16984 $   datos_vehiculos datos_vehiculos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.datos_vehiculos
    ADD CONSTRAINT datos_vehiculos_pkey PRIMARY KEY (id_veh);
 N   ALTER TABLE ONLY public.datos_vehiculos DROP CONSTRAINT datos_vehiculos_pkey;
       public            postgres    false    240            q           2606    16888    expedientes expedientes_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT expedientes_pkey PRIMARY KEY (id_expediente);
 F   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT expedientes_pkey;
       public            postgres    false    230            �           2606    17080    glosas_ley glosas_ley_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.glosas_ley
    ADD CONSTRAINT glosas_ley_pkey PRIMARY KEY (id_glosa);
 D   ALTER TABLE ONLY public.glosas_ley DROP CONSTRAINT glosas_ley_pkey;
       public            postgres    false    242            �           2606    17136     informes_alfa informes_alfa_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.informes_alfa
    ADD CONSTRAINT informes_alfa_pkey PRIMARY KEY (cod_alfa);
 J   ALTER TABLE ONLY public.informes_alfa DROP CONSTRAINT informes_alfa_pkey;
       public            postgres    false    244            �           2606    25513 &   informes_central informes_central_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT informes_central_pkey PRIMARY KEY (cod_informes_central);
 P   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT informes_central_pkey;
       public            postgres    false    284            z           2606    16906    infracciones infracciones_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT infracciones_pkey PRIMARY KEY (id_infraccion);
 H   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT infracciones_pkey;
       public            postgres    false    234            �           2606    17265 "   inventario_grd inventario_grd_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.inventario_grd
    ADD CONSTRAINT inventario_grd_pkey PRIMARY KEY (cod_producto);
 L   ALTER TABLE ONLY public.inventario_grd DROP CONSTRAINT inventario_grd_pkey;
       public            postgres    false    250            |           2606    16915    leyes leyes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.leyes
    ADD CONSTRAINT leyes_pkey PRIMARY KEY (id_ley);
 :   ALTER TABLE ONLY public.leyes DROP CONSTRAINT leyes_pkey;
       public            postgres    false    236            t           2606    50149    expedientes numero_control 
   CONSTRAINT     \   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT numero_control UNIQUE (num_control);
 D   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT numero_control;
       public            postgres    false    230            ^           2606    16592    acciones pk_cod_accion 
   CONSTRAINT     \   ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT pk_cod_accion PRIMARY KEY (cod_accion);
 @   ALTER TABLE ONLY public.acciones DROP CONSTRAINT pk_cod_accion;
       public            postgres    false    218            m           2606    16738    doc_adjuntos pk_id_adjunto 
   CONSTRAINT     `   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT pk_id_adjunto PRIMARY KEY (id_adjunto);
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT pk_id_adjunto;
       public            postgres    false    226            h           2606    16808    funcionarios pk_id_funcionario 
   CONSTRAINT     h   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT pk_id_funcionario PRIMARY KEY (id_funcionario);
 H   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT pk_id_funcionario;
       public            postgres    false    222            b           2606    16788    informantes pk_id_informante 
   CONSTRAINT     e   ALTER TABLE ONLY public.informantes
    ADD CONSTRAINT pk_id_informante PRIMARY KEY (id_informante);
 F   ALTER TABLE ONLY public.informantes DROP CONSTRAINT pk_id_informante;
       public            postgres    false    220            o           2606    16764    origenes pk_id_origen 
   CONSTRAINT     Z   ALTER TABLE ONLY public.origenes
    ADD CONSTRAINT pk_id_origen PRIMARY KEY (id_origen);
 ?   ALTER TABLE ONLY public.origenes DROP CONSTRAINT pk_id_origen;
       public            postgres    false    228            \           2606    16583    central pk_id_reporte 
   CONSTRAINT     [   ALTER TABLE ONLY public.central
    ADD CONSTRAINT pk_id_reporte PRIMARY KEY (id_reporte);
 ?   ALTER TABLE ONLY public.central DROP CONSTRAINT pk_id_reporte;
       public            postgres    false    215            `           2606    16801    sectores pk_id_sector 
   CONSTRAINT     Z   ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT pk_id_sector PRIMARY KEY (id_sector);
 ?   ALTER TABLE ONLY public.sectores DROP CONSTRAINT pk_id_sector;
       public            postgres    false    219            j           2606    16706    tipo_reportes pk_id_tipo 
   CONSTRAINT     [   ALTER TABLE ONLY public.tipo_reportes
    ADD CONSTRAINT pk_id_tipo PRIMARY KEY (id_tipo);
 B   ALTER TABLE ONLY public.tipo_reportes DROP CONSTRAINT pk_id_tipo;
       public            postgres    false    224            d           2606    16636    vehiculos pk_id_vehiculo 
   CONSTRAINT     _   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT pk_id_vehiculo PRIMARY KEY (id_vehiculo);
 B   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT pk_id_vehiculo;
       public            postgres    false    221                       2606    16961     vehiculos_contri pk_id_vehiculos 
   CONSTRAINT     h   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT pk_id_vehiculos PRIMARY KEY (id_vehiculos);
 J   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT pk_id_vehiculos;
       public            postgres    false    237            �           2606    17158    sectores_alfa pk_sectores_alfa 
   CONSTRAINT     j   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT pk_sectores_alfa PRIMARY KEY (id_sectores_alfa);
 H   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT pk_sectores_alfa;
       public            postgres    false    246            �           2606    17273     productos_grd productos_grd_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT productos_grd_pkey PRIMARY KEY (id_productos_grd);
 J   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT productos_grd_pkey;
       public            postgres    false    252            �           2606    25437 :   reportes_servicios_central reportes_servicios_central_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.reportes_servicios_central
    ADD CONSTRAINT reportes_servicios_central_pkey PRIMARY KEY (cod_reporte_service);
 d   ALTER TABLE ONLY public.reportes_servicios_central DROP CONSTRAINT reportes_servicios_central_pkey;
       public            postgres    false    274            �           2606    25234 .   solicitudes_imagenes solicitudes_imagenes_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT solicitudes_imagenes_pkey PRIMARY KEY (cod_solicitud);
 X   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT solicitudes_imagenes_pkey;
       public            postgres    false    254            �           2606    25580    users_system users_system_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.users_system
    ADD CONSTRAINT users_system_pkey PRIMARY KEY (id_user);
 H   ALTER TABLE ONLY public.users_system DROP CONSTRAINT users_system_pkey;
       public            postgres    false    286            �           1259    17191    fki_fk_cod_alfa    INDEX     T   CREATE INDEX fki_fk_cod_alfa ON public.sectores_alfa USING btree (cod_alfa_sector);
 #   DROP INDEX public.fki_fk_cod_alfa;
       public            postgres    false    246            �           1259    17279    fki_fk_cod_producto    INDEX     U   CREATE INDEX fki_fk_cod_producto ON public.productos_grd USING btree (cod_producto);
 '   DROP INDEX public.fki_fk_cod_producto;
       public            postgres    false    252            �           1259    17271    fki_fk_cod_produncto    INDEX     V   CREATE INDEX fki_fk_cod_produncto ON public.productos_grd USING btree (cod_producto);
 (   DROP INDEX public.fki_fk_cod_produncto;
       public            postgres    false    252            k           1259    25421    fki_fk_id_atencion    INDEX     R   CREATE INDEX fki_fk_id_atencion ON public.doc_adjuntos USING btree (id_atencion);
 &   DROP INDEX public.fki_fk_id_atencion;
       public            postgres    false    226            }           1259    17026    fki_fk_id_contri    INDEX     R   CREATE INDEX fki_fk_id_contri ON public.vehiculos_contri USING btree (id_contri);
 $   DROP INDEX public.fki_fk_id_contri;
       public            postgres    false    237            �           1259    25296    fki_fk_id_denuncia    INDEX     Z   CREATE INDEX fki_fk_id_denuncia ON public.solicitudes_imagenes USING btree (id_denuncia);
 &   DROP INDEX public.fki_fk_id_denuncia;
       public            postgres    false    254            x           1259    16990    fki_fk_id_expediente    INDEX     V   CREATE INDEX fki_fk_id_expediente ON public.infracciones USING btree (id_expediente);
 (   DROP INDEX public.fki_fk_id_expediente;
       public            postgres    false    234            U           1259    16673    fki_fk_id_funcionario    INDEX     S   CREATE INDEX fki_fk_id_funcionario ON public.central USING btree (id_funcionario);
 )   DROP INDEX public.fki_fk_id_funcionario;
       public            postgres    false    215            �           1259    25290    fki_fk_id_grabacion    INDEX     \   CREATE INDEX fki_fk_id_grabacion ON public.solicitudes_imagenes USING btree (id_grabacion);
 '   DROP INDEX public.fki_fk_id_grabacion;
       public            postgres    false    254            V           1259    16822    fki_fk_id_informante    INDEX     Q   CREATE INDEX fki_fk_id_informante ON public.central USING btree (id_informante);
 (   DROP INDEX public.fki_fk_id_informante;
       public            postgres    false    215            w           1259    17011    fki_fk_id_infraccion    INDEX     X   CREATE INDEX fki_fk_id_infraccion ON public.contribuyentes USING btree (id_infraccion);
 (   DROP INDEX public.fki_fk_id_infraccion;
       public            postgres    false    232            r           1259    16951    fki_fk_id_leyes    INDEX     K   CREATE INDEX fki_fk_id_leyes ON public.expedientes USING btree (id_leyes);
 #   DROP INDEX public.fki_fk_id_leyes;
       public            postgres    false    230            W           1259    16774    fki_fk_id_origen    INDEX     I   CREATE INDEX fki_fk_id_origen ON public.central USING btree (id_origen);
 $   DROP INDEX public.fki_fk_id_origen;
       public            postgres    false    215            �           1259    25411    fki_fk_id_proceso    INDEX     _   CREATE INDEX fki_fk_id_proceso ON public.atencion_ciudadana USING btree (id_atencion_proceso);
 %   DROP INDEX public.fki_fk_id_proceso;
       public            postgres    false    272            �           1259    17261    fki_fk_id_productos_grd    INDEX     ^   CREATE INDEX fki_fk_id_productos_grd ON public.inventario_grd USING btree (id_productos_grd);
 +   DROP INDEX public.fki_fk_id_productos_grd;
       public            postgres    false    250            �           1259    25284    fki_fk_id_responsable    INDEX     `   CREATE INDEX fki_fk_id_responsable ON public.solicitudes_imagenes USING btree (id_responsable);
 )   DROP INDEX public.fki_fk_id_responsable;
       public            postgres    false    254            X           1259    16794    fki_fk_id_sector    INDEX     I   CREATE INDEX fki_fk_id_sector ON public.central USING btree (id_sector);
 $   DROP INDEX public.fki_fk_id_sector;
       public            postgres    false    215            �           1259    25395    fki_fk_id_solicitud    INDEX     c   CREATE INDEX fki_fk_id_solicitud ON public.atencion_ciudadana USING btree (id_atencion_solicitud);
 '   DROP INDEX public.fki_fk_id_solicitud;
       public            postgres    false    272            Y           1259    16718    fki_fk_id_tipo_reporte    INDEX     U   CREATE INDEX fki_fk_id_tipo_reporte ON public.central USING btree (id_tipo_reporte);
 *   DROP INDEX public.fki_fk_id_tipo_reporte;
       public            postgres    false    215            �           1259    25526    fki_fk_id_tipos_informes    INDEX     a   CREATE INDEX fki_fk_id_tipos_informes ON public.informes_central USING btree (id_tipos_informe);
 ,   DROP INDEX public.fki_fk_id_tipos_informes;
       public            postgres    false    284            �           1259    25532    fki_fk_id_ubicacion_informes    INDEX     i   CREATE INDEX fki_fk_id_ubicacion_informes ON public.informes_central USING btree (id_ubicacion_informe);
 0   DROP INDEX public.fki_fk_id_ubicacion_informes;
       public            postgres    false    284            Z           1259    16729    fki_fk_id_user    INDEX     M   CREATE INDEX fki_fk_id_user ON public.central USING btree (id_user_central);
 "   DROP INDEX public.fki_fk_id_user;
       public            postgres    false    215            �           1259    25384    fki_fk_id_usuario    INDEX     _   CREATE INDEX fki_fk_id_usuario ON public.atencion_ciudadana USING btree (id_atencion_usuario);
 %   DROP INDEX public.fki_fk_id_usuario;
       public            postgres    false    272            �           1259    25278    fki_fk_id_usuarios    INDEX     ^   CREATE INDEX fki_fk_id_usuarios ON public.solicitudes_imagenes USING btree (id_usuarios_img);
 &   DROP INDEX public.fki_fk_id_usuarios;
       public            postgres    false    254            e           1259    16749    fki_fk_id_vehiculo    INDEX     R   CREATE INDEX fki_fk_id_vehiculo ON public.funcionarios USING btree (id_vehiculo);
 &   DROP INDEX public.fki_fk_id_vehiculo;
       public            postgres    false    222            �           1259    25538    fki_fk_id_vehiculo_informe    INDEX     f   CREATE INDEX fki_fk_id_vehiculo_informe ON public.informes_central USING btree (id_vehiculo_informe);
 .   DROP INDEX public.fki_fk_id_vehiculo_informe;
       public            postgres    false    284            f           1259    16755    fki_fk_id_vehiculos    INDEX     S   CREATE INDEX fki_fk_id_vehiculos ON public.funcionarios USING btree (id_vehiculo);
 '   DROP INDEX public.fki_fk_id_vehiculos;
       public            postgres    false    222            �           2620    75572    acciones auditoria_acciones    TRIGGER     �   CREATE TRIGGER auditoria_acciones AFTER INSERT OR DELETE OR UPDATE ON public.acciones FOR EACH ROW EXECUTE FUNCTION public.auditoria_acciones();
 4   DROP TRIGGER auditoria_acciones ON public.acciones;
       public          postgres    false    218    337            �           2620    75584    doc_adjuntos auditoria_adjunto    TRIGGER     �   CREATE TRIGGER auditoria_adjunto AFTER INSERT OR DELETE OR UPDATE ON public.doc_adjuntos FOR EACH ROW EXECUTE FUNCTION public.auditoria_adjunto();
 7   DROP TRIGGER auditoria_adjunto ON public.doc_adjuntos;
       public          postgres    false    226    339            �           2620    75620 &   contribuyentes auditoria_contribuyente    TRIGGER     �   CREATE TRIGGER auditoria_contribuyente AFTER INSERT OR DELETE OR UPDATE ON public.contribuyentes FOR EACH ROW EXECUTE FUNCTION public.auditoria_contribuyente();
 ?   DROP TRIGGER auditoria_contribuyente ON public.contribuyentes;
       public          postgres    false    342    232            �           2620    75596     expedientes auditoria_expediente    TRIGGER     �   CREATE TRIGGER auditoria_expediente AFTER INSERT OR DELETE OR UPDATE ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.auditoria_expediente();
 9   DROP TRIGGER auditoria_expediente ON public.expedientes;
       public          postgres    false    340    230            �           2620    75608 !   infracciones auditoria_infraccion    TRIGGER     �   CREATE TRIGGER auditoria_infraccion AFTER INSERT OR DELETE OR UPDATE ON public.infracciones FOR EACH ROW EXECUTE FUNCTION public.auditoria_infraccion();
 :   DROP TRIGGER auditoria_infraccion ON public.infracciones;
       public          postgres    false    341    234                       2620    74736 %   datos_origen_informe auditoria_origen    TRIGGER     �   CREATE TRIGGER auditoria_origen AFTER INSERT OR DELETE OR UPDATE ON public.datos_origen_informe FOR EACH ROW EXECUTE FUNCTION public.auditoria_origen_central();
 >   DROP TRIGGER auditoria_origen ON public.datos_origen_informe;
       public          postgres    false    335    275                       2620    75535 +   datos_tipos_informes auditoria_tipo_central    TRIGGER     �   CREATE TRIGGER auditoria_tipo_central AFTER INSERT OR DELETE OR UPDATE ON public.datos_tipos_informes FOR EACH ROW EXECUTE FUNCTION public.auditoria_tipo_central();
 D   DROP TRIGGER auditoria_tipo_central ON public.datos_tipos_informes;
       public          postgres    false    338    277                       2620    75547 3   datos_ubicacion_informe auditoria_ubicacion_central    TRIGGER     �   CREATE TRIGGER auditoria_ubicacion_central AFTER INSERT OR DELETE OR UPDATE ON public.datos_ubicacion_informe FOR EACH ROW EXECUTE FUNCTION public.auditoria_ubicacion_central();
 L   DROP TRIGGER auditoria_ubicacion_central ON public.datos_ubicacion_informe;
       public          postgres    false    332    279            �           2620    75632 &   vehiculos_contri auditoria_vehi_contri    TRIGGER     �   CREATE TRIGGER auditoria_vehi_contri AFTER INSERT OR DELETE OR UPDATE ON public.vehiculos_contri FOR EACH ROW EXECUTE FUNCTION public.auditoria_vehi_contri();
 ?   DROP TRIGGER auditoria_vehi_contri ON public.vehiculos_contri;
       public          postgres    false    343    237                       2620    75559 +   datos_vehiculos_informe auditoria_vehiculos    TRIGGER     �   CREATE TRIGGER auditoria_vehiculos AFTER INSERT OR DELETE OR UPDATE ON public.datos_vehiculos_informe FOR EACH ROW EXECUTE FUNCTION public.auditoria_vehiculo_central();
 D   DROP TRIGGER auditoria_vehiculos ON public.datos_vehiculos_informe;
       public          postgres    false    333    281                        2620    25307 &   solicitudes_imagenes cod_imagenes_soli    TRIGGER     �   CREATE TRIGGER cod_imagenes_soli BEFORE INSERT ON public.solicitudes_imagenes FOR EACH ROW EXECUTE FUNCTION public.codigo_imagenes();
 ?   DROP TRIGGER cod_imagenes_soli ON public.solicitudes_imagenes;
       public          postgres    false    254    315            �           2620    17149    informes_alfa codigo_ALFA    TRIGGER     w   CREATE TRIGGER "codigo_ALFA" BEFORE INSERT ON public.informes_alfa FOR EACH ROW EXECUTE FUNCTION public.codigo_alfa();
 4   DROP TRIGGER "codigo_ALFA" ON public.informes_alfa;
       public          postgres    false    312    244                       2620    25413 ,   atencion_ciudadana codigo_atencion_ciudadana    TRIGGER     �   CREATE TRIGGER codigo_atencion_ciudadana BEFORE INSERT ON public.atencion_ciudadana FOR EACH ROW EXECUTE FUNCTION public.codigo_atencion();
 E   DROP TRIGGER codigo_atencion_ciudadana ON public.atencion_ciudadana;
       public          postgres    false    317    272            	           2620    25515     informes_central codigo_informes    TRIGGER        CREATE TRIGGER codigo_informes BEFORE INSERT ON public.informes_central FOR EACH ROW EXECUTE FUNCTION public.codigo_informe();
 9   DROP TRIGGER codigo_informes ON public.informes_central;
       public          postgres    false    319    284            �           2620    17263    inventario_grd codigo_producto    TRIGGER     �   CREATE TRIGGER codigo_producto BEFORE INSERT ON public.inventario_grd FOR EACH ROW EXECUTE FUNCTION public.codigo_inventario();
 7   DROP TRIGGER codigo_producto ON public.inventario_grd;
       public          postgres    false    313    250                       2620    25440 )   reportes_servicios_central codigo_service    TRIGGER     �   CREATE TRIGGER codigo_service BEFORE INSERT ON public.reportes_servicios_central FOR EACH ROW EXECUTE FUNCTION public.codigo_servicio();
 B   DROP TRIGGER codigo_service ON public.reportes_servicios_central;
       public          postgres    false    318    274            �           2620    58356    infracciones delete_fecha_cita    TRIGGER     �   CREATE TRIGGER delete_fecha_cita BEFORE INSERT OR UPDATE ON public.infracciones FOR EACH ROW EXECUTE FUNCTION public.delete_f_citacion();
 7   DROP TRIGGER delete_fecha_cita ON public.infracciones;
       public          postgres    false    234    336                       2620    66535 +   datos_origen_informe fecha_creacion_informe    TRIGGER     �   CREATE TRIGGER fecha_creacion_informe BEFORE INSERT ON public.datos_origen_informe FOR EACH ROW EXECUTE FUNCTION public.fecha_crea_informe();
 D   DROP TRIGGER fecha_creacion_informe ON public.datos_origen_informe;
       public          postgres    false    275    310            �           2620    58358    expedientes fecha_expe    TRIGGER     w   CREATE TRIGGER fecha_expe BEFORE INSERT ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.fecha_expediente();
 /   DROP TRIGGER fecha_expe ON public.expedientes;
       public          postgres    false    230    334                       2620    41967 "   datos_origen_informe rango_horario    TRIGGER     �   CREATE TRIGGER rango_horario BEFORE INSERT OR UPDATE ON public.datos_origen_informe FOR EACH ROW EXECUTE FUNCTION public."INSERT_rango_fecha"();
 ;   DROP TRIGGER rango_horario ON public.datos_origen_informe;
       public          postgres    false    275    331            �           2620    16975 %   expedientes trigger_codigo_expediente    TRIGGER     �   CREATE TRIGGER trigger_codigo_expediente BEFORE INSERT ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.codigo_expedientes();
 >   DROP TRIGGER trigger_codigo_expediente ON public.expedientes;
       public          postgres    false    311    230            �           2620    58349 "   expedientes trigger_fecha_resuelto    TRIGGER     �   CREATE TRIGGER trigger_fecha_resuelto BEFORE INSERT OR UPDATE ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.fecha_resuelto();
 ;   DROP TRIGGER trigger_fecha_resuelto ON public.expedientes;
       public          postgres    false    309    230            �           2620    25225    productos_grd valor_total    TRIGGER     �   CREATE TRIGGER valor_total BEFORE INSERT OR UPDATE OF precio_unitario, existencias ON public.productos_grd FOR EACH ROW EXECUTE FUNCTION public.actualizar_valor_total();
 2   DROP TRIGGER valor_total ON public.productos_grd;
       public          postgres    false    252    252    252    314            �           2606    17197    sectores_alfa fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY (cod_alfa_sector) REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    246    244    4997            �           2606    17202    danios_y_montos fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY ("cod_alfa_daños") REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    244    4997    248            �           2606    17280    productos_grd fk_cod_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) REFERENCES public.inventario_grd(cod_producto) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT fk_cod_producto;
       public          postgres    false    250    5005    252            �           2606    17062 !   vehiculos_contri fk_contribuyente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_contribuyente FOREIGN KEY (id_contri) REFERENCES public.contribuyentes(id_contri) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_contribuyente;
       public          postgres    false    4982    232    237            �           2606    17052    infracciones fk_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT fk_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT fk_expediente;
       public          postgres    false    4977    230    234            �           2606    25416    doc_adjuntos fk_id_atencion    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_atencion FOREIGN KEY (id_atencion) REFERENCES public.atencion_ciudadana(cod_atencion);
 E   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_atencion;
       public          postgres    false    5033    226    272            �           2606    25316 #   solicitudes_imagenes fk_id_denuncia    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_denuncia FOREIGN KEY (id_denuncia) REFERENCES public.datos_solicitud_denuncia(id_denuncia) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_denuncia;
       public          postgres    false    254    5023    262            �           2606    17047    contribuyentes fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 I   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    4977    232    230            �           2606    17067 !   vehiculos_contri fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    230    237    4977            �           2606    17123    doc_adjuntos fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 G   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    230    4977    226            �           2606    16809    central fk_id_funcionario    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_funcionario;
       public          postgres    false    4968    215    222            �           2606    25321 $   solicitudes_imagenes fk_id_grabacion    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_grabacion FOREIGN KEY (id_grabacion) REFERENCES public.datos_solicitud_grabacion(id_grabacion) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_grabacion;
       public          postgres    false    5021    260    254            �           2606    16823    central fk_id_informante    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_informante FOREIGN KEY (id_informante) REFERENCES public.informantes(id_informante);
 B   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_informante;
       public          postgres    false    220    215    4962            �           2606    16936    expedientes fk_id_inspector    FK CONSTRAINT     �   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_inspector FOREIGN KEY (id_inspector) REFERENCES public.funcionarios(id_funcionario);
 E   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_inspector;
       public          postgres    false    222    230    4968            �           2606    16946    expedientes fk_id_leyes    FK CONSTRAINT     {   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_leyes FOREIGN KEY (id_leyes) REFERENCES public.leyes(id_ley);
 A   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_leyes;
       public          postgres    false    230    4988    236            �           2606    16769    central fk_id_origen    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES public.origenes(id_origen);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    228    215    4975            �           2606    25516    informes_central fk_id_origen    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen_informe) REFERENCES public.datos_origen_informe(id_origen_informe);
 G   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    275    284    5040            �           2606    25406     atencion_ciudadana fk_id_proceso    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_proceso FOREIGN KEY (id_atencion_proceso) REFERENCES public.datos_atencion_procesos(id_atencion_proceso) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_proceso;
       public          postgres    false    272    5031    270            �           2606    16855    doc_adjuntos fk_id_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_reporte FOREIGN KEY (id_reporte) REFERENCES public.central(id_reporte) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_reporte;
       public          postgres    false    226    215    4956            �           2606    25326 &   solicitudes_imagenes fk_id_responsable    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_responsable FOREIGN KEY (id_responsable) REFERENCES public.datos_solicitud_responsable(id_responsable) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_responsable;
       public          postgres    false    258    254    5019            �           2606    16802    central fk_id_sector    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_sector) REFERENCES public.sectores(id_sector);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_sector;
       public          postgres    false    219    215    4960            �           2606    25396    atencion_ciudadana fk_id_sector    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_atencion_sector) REFERENCES public.datos_atencion_sector(id_atencion_sector) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_sector;
       public          postgres    false    5027    272    266            �           2606    25390 "   atencion_ciudadana fk_id_solicitud    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_solicitud FOREIGN KEY (id_atencion_solicitud) REFERENCES public.datos_atencion_solicitud(id_atencion_solicitud) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_solicitud;
       public          postgres    false    268    272    5029            �           2606    16713    central fk_id_tipo_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_tipo_reporte FOREIGN KEY (id_tipo_reporte) REFERENCES public.tipo_reportes(id_tipo);
 D   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_tipo_reporte;
       public          postgres    false    4970    215    224            �           2606    25521 %   informes_central fk_id_tipos_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_tipos_informes FOREIGN KEY (id_tipos_informe) REFERENCES public.datos_tipos_informes(id_tipos_informes);
 O   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_tipos_informes;
       public          postgres    false    284    277    5042            �           2606    25527 )   informes_central fk_id_ubicacion_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_ubicacion_informes FOREIGN KEY (id_ubicacion_informe) REFERENCES public.datos_ubicacion_informe(id_ubicacion);
 S   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_ubicacion_informes;
       public          postgres    false    279    284    5044            �           2606    25401     atencion_ciudadana fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_atencion_usuario) REFERENCES public.datos_atencion_usuario(id_atencion_usuarios) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    264    5025    272            �           2606    25331 #   solicitudes_imagenes fk_id_usuarios    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_usuarios FOREIGN KEY (id_usuarios_img) REFERENCES public.datos_solicitud_usuarios(id_usuarios_img) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_usuarios;
       public          postgres    false    5017    254    256            �           2606    25533 '   informes_central fk_id_vehiculo_informe    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_vehiculo_informe FOREIGN KEY (id_vehiculo_informe) REFERENCES public.datos_vehiculos_informe(id_vehiculos);
 Q   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_vehiculo_informe;
       public          postgres    false    5046    281    284            �           2606    16750    funcionarios fk_id_vehiculos    FK CONSTRAINT     �   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT fk_id_vehiculos FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculos(id_vehiculo);
 F   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT fk_id_vehiculos;
       public          postgres    false    4964    221    222            �           2606    17057    contribuyentes fk_infraccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_infraccion FOREIGN KEY (id_infraccion) REFERENCES public.infracciones(id_infraccion) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_infraccion;
       public          postgres    false    234    4986    232            �     x���K��0D���������H#e�	��"4!���'�H���U�]2�7��r���u���:��x��Kh�UBCQ)g�Bք��ŏu֜���/@,΂�8,�m}j�j�b�k_AmWr�.l���6v'�1]���\~PFs��8t���$Z쩄q��o����r�1OŐS�N��"1b�+�,��j��kgS�}oW�X�f�c�Ө��S�c����N������tr��Ӯ�JQ�|嫜r�i�      �   }   x���C1Cki���o�]�� i��4���1���'�O�a��*.\��]qC�B"����ì��,���8�S��o���LEukIV}�����,g���9Z6O���j����"�[�#w      �     x�͒KK�0��ɯY;%϶�np*H����4��H���3P�Φ(�����;�F�\�d�8�\S���hJ�J���f]d�[_=k�����
�J����>h�P�A�9{0��Y�\gϢ낌�j<zm��1�pp�s]o*?{~2m]�������s�D��q�w�$Ⱦ�)�:c.U
6�m�,���(��@�ik�"�$Sl�쾘��sv|��o8�s~<�'B��U,�e�1TDW\\���a�8����Ծ�      �   a  x��Ok�0��ͧ(9kȟ�ir�e��V�f�Х#kǆ��d"�a�0e����������b��X�)	W�T�"LiLy0���2�@Ӽ���*���p]Y]�Uc2]];T��ƴ�rHDئ>��"۵G칲�t��ǫ^Wڴ�Õy�E��7]����l�<t�.A1�Rȟ��?bǎ�A'��a>�Y��]�]��e��^"+"�H�I0I�R�H�]h(�좐ť�qɨ$C�/���k�J<���}<!8�ߒ����(�M�����ە[�l��m�V]�t�ǅ	g]a�q���b/c�UD"�	�_���#�G�%	e'>��c���ǀ��1����# �0��      �   �  x�ŕ�kAşw��a���~̝�}mР�R[|	����)��7P�w��&FJJ�y<܇�9�^3�\I��+��x�YB6��eߊ�����.��-�4�ߨi�v��$5˻��V������_b���t�?g��������yғ\t�e�R�$߳�8�M2A�I��V�p2^'��X�������lx ��ߟ���V/�>�ܬ�A8m�ඦ�)�$C�أɎ������<��ɌBJTюȁٚ�c�.:avb!]���]̣zE�u��_��6Y�s֡�O�/���uVW����ogu�:�btr�`�3b�Jҷ�u�;Q�}RZc�e|(?����AשѼ��j��%XU�*q����I|������{�"`@<��y��@���n~�ۍ�/��S�ࣟ�����O�      �   >  x����n�0�3<�yA��s��h�4EQ��"E��%��gZ5��v�#��f*%��]"���|�M��G��f�:�F�D��Ax<�n��jc}E:٩/9���7�TY���Y���`���Se�rH��?��$�@��S�ˤ��4�bVw1dUioA����+(�j]�b��o���D��r�L�:��i���J��*Ռ�Y^�iZ�*�$w	���4�{@���ɣY��:֐u�P�vy���Q��4�{k���0w=��'F��8�e`�'�tL#&�P��S�����f>I�,���
ʿK<E������"�>��3�z�an��]L�B�i�1�0��p1Ǟ���?�^�;`�1�LD��LP"��+��"Է�X<TEK����- =�ES�"4F�ջ���A�e���mL�<n~Ͽ!�֐�XW��ht|l�~vЋ(i��+<L��H(䐁��,�eDt�|v8H�D����!�gN)��+�e-N^�j/6P�/��TY�����÷1��x���B�Թ�fYg�?��o�?�ߊ�X���fDl<s�i��P�[�X?|��ֵm��ǣ�      �   �  x��_k�0ş�OQ�<Kn��&o��CD��M��ƭ�Ui�~�E�&j;|P��rrss��Pp(��E�e.0%@�%�w����>r>�K��VnVN�W.N��y��$5����i6�u����mߊ�qa�7��LaE<�K3֮.�t1�S�m����z�]m�۹�ﹶ�;�T�&��j��47k�pu���R �I�r'���гQ`�؊P��<:�Qxr
�<��n`����e'��a��z�p"��	{��wؿ䄑�"�.�RQ�	ɨ���׸���-p�uD�Z�ո5p���W���׍�b��'��ɍ*FHO`�l�	
�b��I�nӦ�z.4������Ѯ+o���j"�����fU�[@mu�.m�p��\g�.~��Ӆ;��W��i�-��C}���      �   H  x���n�0���SD^��?qb{ת,�:���
����90��w{�4L �))+�\��{m9b:�� !a~$�	�"g4~Nb�l*�g��I�4^�)�,d����r�􇬇uR.��]�D������p���R���i�Zo�~|�uU��3��RY�uR��ZG��a����`���ԕ*w�r��{�L�.nr	D�BH���bu�ra'��&�PP�C@|��bu�r�'�.��>e�a~s\ֲ�U�.�܌莊����@��8?_����@��J������nب�	}	"��<|�J��o�K���F5��CX�}w����6_�a06� �#������C�+98��d]f�����	�d.��x��=�U��bc'��8ٕ��,��`la���J��Z�˥�Vz#片����ۭ��OD�}D#�I�Ev�������@��ҠR���R�eRx���&�j_+
[\8��w*0n�m���jG�oSЁ)��~�M[B�ޤ������Bz[.��o�Ny�6� �(4�\�MЛ�m�ΥM��M��>��k��7��	;�]����l�      �   �  x���N�0���SX9�e;���F���j��S�B�k�����ת(�������fK[i���L����Ip@a�(9&1�$�IFR��g��}��]Vf��D7Κ�D��ɯ]q��y^[�O��t�nĬ�J���>�q��S:[+��ݬ�.Ua��Aeei����6X�Cҗ'2� 	I��"��Sy�<�B"�<��8=�����Bށ�%����~,0�B�88����L��CK��ȣ�<ʳ�B$&t\ހ����+m��;Yօ�@��J�<��`�������Fں�����0>o[Ȫ��[�nt^��m�i���#�^ܢ��t�����reV�%��iېoa�3J3B fI��-�癞��\��%P.�
	�i��*7����|o�Wn��1���P��c��>J��2��#KqB9�rb��}���'1G1� O'��嵴�5�aK���6y��zm	�0|�K��      �   S  x�ݓKO�@E�����Z&�~�D���ƀ�H�ЎIMi�PB�ﶸP���`��79�Lb*X(�Z�,Q�P����i4y
�0K��"K\���@� W>Y��<+^�j�iQ�y3O��'��#�^{�� [�����]0�Cz�fQc�f�h~4;F�0Q����qt���q-9w -7�2!�hK�D,�Q�5&���2���̥eaM	��T����-|�r�� �����py��O�qw}ъ,=H�ks5uU�>�<��,�RD�b�D��ᆮ�\���A��$��O�U9��#-WH`,��܅��(�]ke)ADb���Z����S
a��b�
��!��r      �   M  x��MK�@���_��ن�ٯ�ޤR�R��
%Mb�D�7�-%�(x���q^��gf���p̤��r�C���x�>̼R�5�8����t����Z���J�b�<�"�IVQN�4.�b}�/_�u9Y�p�uVl�T˯,y+�U��Urx���]`�|�������O���,�V�o�)e����f����2Z�_���Y7�:fi�NS��7
��F�|rQ��<1���>A��p0�]7!���OZ��.-@�H��!�l��T�X��P�����$�H�2��w�d8���K+i�4�.�²�����@�wP�L0�B����      �   N  x�͒_K�0ş�O��B�'͛�"��9�/NF�E,�vt� ����n�*���B��9�ssi��=�{�Cʬ$�+̔1�F����8�6([L��C6�y�B�����iVܗգ��+�VY��b~�+P��U��yZ��n{����|��\ވ?�p��*���4�M�� kǥ�Q�b-����y�N� �C��H�A�r��a������@��a�����e��,�|��f8:ᨾ��U{�ܭ��S
B�	��O���~c�y����2���<����*�?N@��	 ��:Lȶ��BcIHX�ε���_	զ���RE�P�K����R����9`�	 � �<��      �      x��Msۺ�L�
�O�T���s���6o�c'i3/9 &m3O&e���M�?��z��'��'H��$(v�4cE$D�b��]`�����A����3�`��aDAb��0��O-+�A�us��ǖ�����:8=>����i�F��GG����c}ٝ�|���%yd�;�/w��1�PH=��!������*��̣8�w����*:�O{���O܆��u��y��;�u["��g�v�X\�<㳙e��azY�c�,��xyI�����0��u�wH@Fu�!`�<����@B`��/>�$ן�4���D|��_��._�?��_��,<?���7�Z^�i"��v;TaM#ڝ�ʌI�������Z_v��;�lH�6	ޠW��}
ֵ����U���J���o���A"�;�`�4��[y����0��i��n�����sC,�A�(��Ђ���O>P_+��4uZ%�����nS�{r%�Y������J�Jl�Cb+�d�ΛhsҮA��0S�2S�<����"��P�b)����8:�fbr{���$�F�4
�ˤ����6�-�S���E՞H˴�^�WV������Q�T�'<O��)�,�zx+zݶf_��3����OЍ[�aK�e��b�䠖> �[���s4\66��bzNb	$k(̖jg�!M�8l��ҁ4t�{�<��*a�?&/�h�(26��w�E����8O�(����t�S��ߙ��nSX�+{;�1�h�ky���}�R�����,�;{����j��]K�O�C�������ѹ,~��X��Ә�4H�%�v�ǓK�D�?ZƽEx.n
^EIOSx*�0���<�!cp��|�Pe��+�d_� ������kPh�����קC��m���I���Nk�kE��5��̫tV�S)ZƴEx��������~D��=J |{!�7�p����bs ]@��'۷�-POp�ڂ#x���:r
��;����TD}nE4�v����y�ˋW���c^I�H��C��6�Ռ:ͯ���pb��}��.���^�#���	��.u!#=��΅���\��s�B���ǯ��qZJG�rv�E,莹mu�,��u���������2��Q�7���6���D�5h�n�'EX�H��!x5��X�~��K3 �E#i�,�U޲�t���fj��Scן֮ɡ�P�n��R �S�U�nm�޷\�U���������-�B�X���~*��i�L�w���'0���U��C�v����Қ���,�`������l�!m�rd�|x�s�6!qk��2j؈�A��ޮ �*�nɻ��[�%��"(H�$Y�'����jAC���ʙ�����ë́��, x�m���Tet�,(�����]^]\�/�[(�S�$��S�	zq���l���A������7K��N�Y��}^o3���d0c|�e��h�%e{�ږ��ζ���N�� ���q����q���:��q��C��!0cƻ̞�Lz�2�ˤg,���Lz�2�m"�_����&R)�se��� �DH��Df�d+�0j�u�3�&����:��o�Iߜ��v�7��p�Dc�
��P႙�$�A6Da�T����`u����Y�v���w��_�rBV���������}�R�V���ND2�ҿ�΢���a;�ц��Ts*�������t..y'?�E&n../���l�(�����?U�3-d�$���}9P���=�˰���>e�<g�csՖ�xcx�L�b4��P����7���A�lה[L?��g"�������O136n�8d��t�q<�����'�޽^.A?��5d��&)@��l�%�u���]�m9�jB�I�dx�?}��/�A�5<t�#�NyO�*A�Q𓡄<2%��C�Ȱ0%yخ�tJ �|��SEiK�H���j+�}�K9wi"2D����!"���h��_��L�!�l`ƛ:[��0�����Ð=�E�Om�5�>�@nr���O� �7kSB
��������P��^)��c�}]^3��t��s�G����K�Hn�>����-��}���Ap�CtW8�+ov��*�1H�E@���?&���_��~��x�|�#}�R~m�&�ä́�	��`�j�G��pݖY����n���a�ٓ�;�`d�x	��I�xd�{}���~߈�]�p���	_�s`����!�-�)�[��,���z�;{T��cbg�1ClFV��U��d4�`�/<"s��|��8���ȼR�ۜ���Ք҈G!��9Տ���G��@!�z���ۅt=V�5BL�����`�@�<��a�����Ȑ:z�9��S9�)�ZxOd�����"�+��s�Gܝb�<������t��KQ���U<<<��_޽r'�ق�W����É���,�'����9�ă�<h��Ks� ��+�=�`O��̤�B�m�XQ���B���ߊ?~ų@�/�W�8�Yn�	6��ugy���4��dj�a���~b��Q��oc��b��v�S��2�C}*©��aË���j=��l΅��Jq��!M��!�ntvB-�$�d:3��OC��ۣlƿ���;>p�\�*Va��1�m�[���\�dE��ZlYqr<��\�N�
TB��>�Ӝ����GqC�"����k�����,��7Ļ��}(]Nm�,�\C�I���K>U����`��T+u"�AN�5b�O"R�G!�Y�e�o:�^�@OE'����ݘ���'<���
,�"��ơ�q��ͺ��J|L�B�m����^c}��o�y�cA�o��}WC��"�� ,��@ZXQj��:A9�J���A҈Ď���c��b).��8��,u;)�|����I�I����AS�mp���/�8+/������~�����ic��Tq���H���W�R��X�E�.ndB|�H5��a��r�i�B�[4L>R*���QqӺ#CE�Y���VcVT�<^�yD�G���aigh�����������ٮ      �   )  x��TMs�0=�_�rn;HB�����Nr�E	B����L�����.nq!���o�~�i{خމ|���m�6�j���z��݊�
k_cw<�f��z��ۭ��h/��	ܭ�<��k�����K�~��]7V�U��n{��O;�Xu�����?�!��>�r��ٌv����h�n���X\�����:u�3nre�����C��lp�
�%S�ȱ&����{2���˔��l��V�[����u۝�`d��d!����� Z ������@�#jg��c�txq�y.��kʣX���e�1x��R}���1O�m`C��l��n���ֺik�6�����){��쒕(f�Ï��I����c��6���}S�^c�8��ԦHm<JmJ�bA�ao�FCia$K���8q�aʼ)�`k�d��e��N�^���1�HX�ΨeFҟ�1
�y���h���I��I`h���M[jhKE���r�Q�2����T%y$MM4���4=�H%0c�hsm	��I0db��cBB��;h&�X�
̝�`�$�����      �   X  x���Mn�0F���봊!]w�d3`� �U�C��XMB�ȦEba3|��A���'���[�e�s�KS>Mܟءf�KcQ������k)z��/7�a�Mܚ����!�5r��*օ��i�N�g��ĸ��T`�t.��A7�]e�B�=��M�/u��(sK�yBA�VE����)�{)m����.q��N���]"'�tKy�Pk��}Ў�����;��=TX`w�/!Í�t��I���%��fH��M&B���D��X�'�9[7Hh��`2�T�orĶ�UqP�X`�#_��5����߱��ǔ���n��y�ܯ�8��?EQ��*b[      �   �   x���A��0E��)zF�Kh�! �Y��4X���Ϥb��TH^��?���ح�9��&���;-�Fb^��e��y��P���F-�ĕ;���8DC�~	��~�tg��7�δN�O��@L���L{�˧QՃ�NF�κ���~�j�@��!G	��Y�ę�t��K�/Qt�|�F�N����y�ջ���
(�߷��n�%����-      �   X   x�3�,(�OJ�K�W��� .c\��$�pI�㒰�L,J�HLI�����D�p�)CN���3T�9�\�ц�\T�c���� �	?�      �   �   x�uOK�0]wN�	�5��J"��)�	!5zz���&�4�;����!)O�J��0��	���Ƅ,&��&�m�C(��&M�e��"84�트W����4�ܺ0�PƄ!���)���Gn��'�f�
�	�u��^h�0���h�m��8L��2_��Z��EӤ��������� v�S���f�7 �+|�      �   �   x�u�K
�0@�3��	B'�i��'PA��DC������5U�b��������g���r���y(9P���Tia�4��G�����}L���'h`��c븒ɀ�M�~��T��[�����>6��K1.3��ݔ6��6�4~�:Dl"� ��f�      �   �  x�ŘKn�0���)�k�o��%AY�Ң�nh�IUȒ!�A����z�\�$����D~������?�R<B �	�@�c�b F�B�*�'2�T�HT�V�_�L7*�ч0�3��qx#9K2U�e��Y���ס3���b)�	*X5��3�Y.���T��}�ߘF5� h
S!I^j��I��n1H�B�r]l�T�P�}��5w򜟎�;2n����ڸj�_�Q���TV��
��/ "�<&hJ ��A�qD.���-@���S�	 �b�� bk@/��wYiLĔr�EdY�o�
Y��U��,�Q,�@�
��M�̓�L;���Mo�:�h�@�M����'^�G��&�VK����ů�����0�?+�
��qSW��a3C#�J���bf�w��%�뇫���;�c>e���Q�\�L.%]Q��!�bP� A���Ub�[�>_��6, ��*B�h��0;�Q� �B-s���Ɏ�t 
n�T�o�&��˟�&:�`����!�RìF�k��	�"�}$�Vz�_���H�b�ys(2G�iw�;��Cπ���bL��������&�-w�H������:���v�J4%X[��޳�������*)
}���W �i {Ӝ!`�-bB��@�`H!'��v�t�=�s]?�#E��e/!�j 2A6�W��k���	��V}�x'˜���n1y��PPe(`ϪN[8{MC7yp��ח�O�,��*�2U�3�PHmƙ�i���:O���
-r4w(��NS����z���U=9�5\%���#�JR���.�����D#�X&٘{��nb��٧t>��E���B��{�����[���.%����u׬;T���Ҙ��
�׉/��^�.Ӫ�mʞ�ݿ�hPH��P�o��x�7���      �   .   x�3�H,)*��I�JU(J-K�+�,��2B�ͬ(������ �?�      �     x�}��n�0���S�	&b'm���icl.֒�2�hIA{���t������?��`�7�%�K4����z/�ڊ��|,c��;+q��t���0U�����sG��.���Жu{+���mlnV�����4����Yw�.��������Aֶ���{�}�SQ�bb�#p�&et�T���	�W'��8�n�4�F�J���K�<��mOj�Y�X_�dJ9X_�Ⱥo�X>���r�@6@m��0>t�"�2���$a�0%�	�sx�?�ь���~����� {괬      �   &  x���Mn�0���)x��II��,�m����flR?�B�$��*z�\�#ډdG�Q�d����py�?�E|bLL�%����Mm�r�b:'fs�bN���%���4�Z	^��,��ټ����(K夢?���dd��z�c����1ʲ[�oc̬�%Ȣ$���z�]��WGlAdQ��ߊt��&�;���!�X������'/��$����^ElI�;e�'��,gWR�1I|��٢\L��ڗ��E�N.D�Q8Y��⇼�� `���X\)O��� �<Eyؖ�/d��ǧկ��հV��rG|Av~o��	���	>�0��'��V�h��fɡ
"&T����ӫ�%���?����clܫ0?&<��م�q8������	�!����dڌCѾ�@[�ո%zrڌ�]���Y5`I��2Z,'-4�����h�p��f�X�982\]H��u�)hotm�������5�4�K�7���m%o?�Po}�����p^{U��Wk��i�B[�����Wh̣�Tw����#��=>�������      �   �   x����
�0E��W�J�hK�.|��s��lRj���������@�KN2	������pQ�� O��K#c�.���d
�%'[>يɶ��Av���w�㷎���PYl�}Օ�iP��ee��4�hKTE���xt�|2A�)���G_&Ф�%��Q5Va���I��@���52D���7)�#��Hou��D�#8�K�궡2퓱���2�R�]��q      �   @  x���An� E��)�@"��!Y�m�v�1زd�������H!�$K���g���pzg���vb�%��I�O�a���T�џ����ਯ�a0	���#E�<"oH�z:]�	�X��e�W_����֍��Ϗ��X&ak@	�aі�Q��
F[�L���x�E�&�򆯏Q�j�F\f������G����z(�/��?:n�KP�gC��D��6�f���u&�t.�9�GF��&���$���C.	� H��P����7m��|O����1��rv,�����a���y���wm�s	.V.�̭`ՑӞ�$�/      �   :  x�͘�r�0���Sh|��B��Cno�3`z�6�슑� �)Ӈ�z��5/���D*!ͦvۙL��+����jW�������@t�?���0a�?��K�sE
&H��l��E��^�Wާ����Z�	_9�l�d�gʿ��mz�m�t�d��w�q��}��k2��0���V+���B%�T�f�v�Qu��M���H����4��@�ơ�z�j5W�d�����?}db��}���Ƶ�������?�<�,.�+̂�r��5֐�c�Ua� ��5����D����x�KR�~�T	��J/�@�AC��f�|6\����WP|�G��Iu�t����J�k���p`���K��RCQV��tm��N�x,XY��>���إ.�)������]��C� [�܌�9�{�>q�B ���v��(Ar�_،�g�MC���(�O&�IJ�����7y�g^q��yq��H�)ڂ�-2���"AWU	:&c��y�f���'h�	�y�f����h�)�y�f����h�)�y�f����h�)�9�wOh�͜��S4s�fN��)�9E3��il:9��z��j�����C�P�@�_Y��;�mk4gM�V��i<��c��!��N�n��*������N��l�	�Yr�++sf���W>\X�z�S6��R�v9��ԑ��E�)l�3��{�m�
SZ��Z��E:�:ܓJ����a��>Z�!�tԽ���g[�� �Ȏ��{l����Mꨠv�MW/��
�����0p�nX��z��	�A���i����q&��0[;�}���RK�}�8��)��%�S-��=wE�&�E�N�_�F�?����      �   �   x���=o�0���<W��+	#l��rm�r0��޴C�ތ>=g=~��K���s�Z��fۨ�+Ŀ#'�8��Wn�k6/ܚs����,)��������������t�טU���4��Aނ<v�>���m1�(3S��:�Syc���Y�`A|	���l��ǘh�`��XTցVg��A�iD�-�_f=ȕYvC:���L�&pe�������<ޣ��{�/��<۩      �   Z   x�5�K
�0Eѱo]��Ow�TB%R�?R��.\Nݾ��R����V���݆�R�.4���
q!!$����)8�\PJA!����2�      �   9  x��V�j�0���07�K�lw,�N	i�.M'4`ڒ�,���k�j\˖R0�O�N��O��y��2n�i6���r�+|�����T�����e�P���-O��Ӕ��-�$�_���#Xk�šN�t���,3B�l�0�����a�t�P�b�˚5oV��k����h� ��+N�R�S\�r:��������aُ��w�&aِg���u���Ƀ�t���u��$n=G �0iy�ߕW�v1���3��#tՈ�hٯo7�&��:�4L�I
h��� ����D�T�գ����:��1v ��3      �   �  x����r�0���)tl�H��hJJ ��^2�FI�!�����}���*cc�4m�`�ޟ����F٣�syģ�ExF��vX���*�gD�a�+�z����wis�W>�|�P�E�ta*�i���ڭ,�Hwm�ʢ�C�.����e^�Aa[��)����������|�/����H5��๿�UVx����rx<*�I�CSM=4��24��ֆ�#�;�ƀ�7���Ĩ`pΌZP��ʤ(Ь���B�B 1��� qw#=EwC�D�=�4a�43�O0����X��}9YrI8�B 3�Sf��P���Rbv:�D������8�N�c����IwS���7v'�w�}\�o#v�TSA	'�)����ne��gě�0JB�0�<����
Mn����d6N�A�z\�¢Ji<���l2=C��%���b�DW���bz������J��x�p��aȠ�A:��`8�8_$h2Eӫd~��g?�~��@�I���S�}@�>{r�=C@�PC�Wu�T��E�������:.�`L�qM���P��֛�}p(�ݳ�9q����ve<�(�EfwM������.�@��v��i�D�ݵ��a^���,�	A-�~��YU�]��{5�9�7�G-Ӫ^m]{r��{E��g���ʡ�	���m����Ԇ�ߊ��D�� T�_o��ܵ��A���v	��ј��u<�~[��6      �   o  x��WKr�8]C���.��YN���q��.ZBbVф,�Iy�4�9B.6��h�ЇpL��*U㱻_����t��+��ƿ�Z׿�kɍ�����C��[qipL�	}�̕�(����}��^p�n�v����`*���/"� �K�$�h�m�~�6_���_�6Ou;�˯ψ"�he��Nnm��m�۽G���R�Rg � ��u�m��'w���u?llw ��s[�:N�r�Q��+�{P�4�J�)жH��F�������R��1����5=��Br���}GL�<a1]S�u5tUw2H9�̥��q
�K�G7�����I��ѧ���vU�qtS���k��ۯ����V�nWѮ�σ��rB�F�uJ�y(m����,!gh���tci;؟G['Z���h�T�^?8��j��ʓ�J��,��<�V��H�Œ2���PI�H�H"X ��$�"�"K�ENER7țH�M"o2�7���$�$�&�x�țL�M#�غ�_@F�%��ݹ�����]X�_�I��K��;�C�44}�m�o&����H���4�Ƣ��z�� {��]a|Va�z�*̝�o[%q?�,�"��m}�^\A����.C�#>��3��w������ 0ruT;o��4(��ɒ�g�g��f�3�3uT��<���&%N$N!q��VxKY������w@h̶f�!�T#��桸G�x�d�p�J�\9Q���cYD*T%4ϋ��뵪�<۝ _l7ئw�P�U�I�*��a�S^#��L|������ydL�jWQVxP��A���]x).��&ˋ��oU� �ɮ3��R�8��`����2w"r�c�c��!Y>.�<��>.Ju���C�M!�?q3��^�t�\��2s"��_�����g!j	o~9�����(��y�*����G�w��0�.fxA��i��48
旼�LH�O�I�X˒���^�y|�Ox���{M���s(����4���a�@Z�~�K�
�!��xY(3��*
ϯ>퉿���r���Ah/&J�@��^Wf/� &4���ϵ8�mb\����}B�:����b�(b�� }yо����/�����"�X��lF��0/q��̃R>�E�������y��z�Z����      �   x   x�r2�,-.M,��W((*MMJT0�,� I��qiSt�PƜ�~� %��J�1���+1�[Sb����$  (�]�!gЕpityTy�
�A.5@H�%Fp�*����� ��[K      �   %   x�3�L��/NT0�2������,c.(˄+F��� �a      �   I   x��r���K�/�M�+IUHIU((*MMJT0�4426153�����2��D(��1ⴴ0735162����� �	7      �   u  x��T�n�@=_���]T�5i����դa���BW�b���E/�M�ͼ o��{��0q�KX��J��(Ѱ�K�	��
��rT�jy������BY�RI���8�ؖ�Rݩ�Q|pw����K����c�R�S�b�d؃)2�3b�B �^�����)*��}�%�l*�3KI�x�q pƏ�4c8�c0�}��B1�>K��PnK�:c�-Պ���ǆ��j�" �;������QC�g0�G<�#�g<��O�t�6�t'6�t'J��4�
���N�򉳖�M*�h�Sa�� )z�<�a��L�{�
��y�ݼ�oj�7ǈ5_�n��К}���fw���^�=����	�      �   )  x�5�Aj1C��aJlǉ�.��	z�sTSM@����O������˷E_-x+�p�6�(=��U4b����Wq��s\D(�W�H��U �Ru��Rʡ�&b)]���F��*B�h3^�F�m���o6R�h���%�A���u�,��n�Z����A���j[s�0�T7Z�5	�Hu����"1&R�h�m5x�n�E�c�z�n�UvHM�/������5P��3��x�Q"Va\�@	�i\���#�3�5|p��%��%6�=x%��)��������܇��U����{٦~? ��x	      �   �  x��U�n�0<k�B9.��|�؞E���`,�q�H��)�a���:����f��>�@����?�k	ra꼰;5�C���K�8����}����K,�Kج@�.CF�KM̆�F��n%Ab��w�o�����c��_^�'	�����T��?��1l1a�ˈE)��}H@y�� ���T���Λ2�����Յ���H���]��Aʧr�sT��T����Ped���U��[�>��j�4�^"�~�<���I
�7I��")$n�(�N(C�) ��i�$���@'_4�J{����\r��sS��P/�$h�:�*tnC&6����O��ϑX���;��`U��>��a6f@BG�D��3�*;��_>"q/��߾��O�I����0["ẉa��a �^֑*� �~�����q=� Z�Y�_�!��p��wh1h}ܰ͟�Cc��I�Z��H����4�J4���`�r\��H�p���
���&=�(4084�,1¼��P^��p#�-3ph3X���$�����!�p����B��Xw�]������zLɀ�������>����n�ۋ�О�8�+�Ӡѓ+�s)K�
����O� ;����_Ba_�<��T���0����+ �w�      �   4  x��T�n�0�W_�>p�%wɓ��q��n�(�9EX�������;Q9��S8��هDz�^"QT��bQ���=�{�8v��9G��h#�ާ�{	��?��q&D������[���C�z��;�����^�4r0�ìV38��.��1���7@#ƭHZD461#��y,���q�_N:j���<�	ߣ��-!TŞQ~F�w�Ԩ�7Zjd%��p{	|%
�/D	���bl/E�����}�=�٬	j��= ���9j�]h�Q����w%��AU�e �pu�F�!�ά� s�y��3�6�s�j*�f�rm����-6 �-��/(Uޒ�����m#�2&b2aqn����: -���(�2�s��L�r�����lg e�wKS�X��,���n�m�h,s��q�Hux��J�kyy_��O�>�eT�:�Q��uT�S| ����c9p��+&ceRm�4�y�F&���:�9���f<�_ƌ�����n�����c?���_��Ш�6�pFB�{����@���咄�	���� K%>_t�
`� ~�	W�
�r��y|�4�/$u�      �   #   x�3��I�T0�2��\F`ڈ�Lr��qqq �Y1      �     x�M�Mn�@���)�U��!��(�n��A��	OP{�����հ(�l?���la�6�H��A��q�V}�UE��p�I��r
)����w������{>�����mp�[�5Hps�Sg<���)<�$>��N�b��n|�9��u�>�"ȑ��NݮX��%[U�m4��"�,+�}Xg�+��\�]]�2�H'�ʧ��Q�gRm�EQ+�N.�ǰ%�Aa'�=�؉ٷj,]y��J/��b��B���"���q�      �   6  x��U�n�0</�B_`�䒲�v��KQ��QˏƅIn���,iɏ(�z0E;�;�;�֫��zא6�;z����:PX������d�+��Ou�T��L�O��b��������_2=q�l��{��7	Z��\A�����>���A�Ql���[�Uc��;坭�sA���7�`1�d/�M��=����`�/O��cq�
�՜4tȒt^<���D�ҍĒ�E�]��o!N�v0�ȏj@^�/�ڄ�׶i���f@DN��+a�9R~ѲL1���lW��.��R�P�K���.�ɜ/7dD����^{n�$|IR���k�{���*Ο\l7�l�BO���S�w��s� r�!�E��QH���7�t�C�uT���G�N��M��ؽk焇r��^Ɂp((+.�		�)�ݥ�V�~���+�Mf��Х��8�x�U���S}w8�~f5����؜~��c(�m"kk
[.0M�Jr�5�MU�v��i�c����n8���-���f�2�K���X~���f٧��L����εT���?���b      �   x   x�3�t
3��CF\&`aN##S]C]###++��Ĕ4��bδ��ĔtN /��L�zLzL�zLAzJ�K�2�9�R32�Ks@�̼�d�XqjQ���Q�a\1z\\\ d(D      �   9   x�s
�s�tJ,*J�KN,��-JJ�K�
����N�S�*M���*-J������ v      �   �   x�3��CC\�X���a3�ŉy%��7���%���*JRa�D�C#]##.,�[bs�)g�BPjz���y���y
�@�2�Q�E��I�
���&��̈�fh� u��9���p�%�p�C���qqq !�g      �   D  x�M�Kn�0C��a�H��9A�E��v��R�d� ��6r�߯��9��+�����O�X�}��8�u����kY�ȷ�-S�#��6�̲Y�HD�&F^�Bi���mN��L����H���y�Hz�;�uW��|>T��C�IUQPC�I�(�
@�,�+���T3�̮+��V��-��%@��t�� %V[�k	P"ZȀ��D�Pw����&P�{��@�-���	T���t7�
�Z8��&P���t7�GOܺ��&��%nAwx��3�n��zb�t7afO��t7aVO��ta���{L���1���������4      �   �  x��X�r�6]�_��*�%�Ai�i��=��=n�W�I��$4 ���7YfыTv�Տ͹ %2��ꪖy���8���Ɍ]��7-7R)�X�$-�r���6I)#����t2gW����6�;aZ}i��f#L��ck�,��P���'x����'��s%�ѷ-�߹�Wߺ ;-�JT\�aV�V���W��R�N�����fW;i[^KѴ�L�V]�p����zd�t��5���<��$;�(�Nq3�jZ�6��f'���Ekd��@��@9��4��p-7���x��7;�;U�5�/�܈��N��*Ey����'��aG![�`���ܠʺ���Fp�nMIFt��eKvM�ڽ�Q�F��ѣ�eG�����d��"W즔d8ߔ�yŁ5��>�c�;�������-E�ZS
��Q��}�;Y�w|u�}���o��:�h�Q5�*���W�%/�X���~�:�ȧMd��m��M�/�ܵ��APy.����sK�J�`)���[~��m��p�|
w_r�Rr�����'���SK'�(Ԧ/V�̔}l\JK��&��t��� ����y��B̌��jY����s��
�6����ܜ�l�/�B�;�%����?��p�[L��urws�<||w{�V��7�^}4�����rѵa��G�BP��/�쳬A[�	�\��F��<JZ��2>`���Ŏ��L���r�JP��cS�5/.�����n��1�W!��U�60�6`gv�W�=w�*N
P&X*M�D�L����&�/ޡ�\�Hϭ�y�lJ�"�.ka��9∧ Id`�W���
/�q�M#�N�m�$����-\�G�&���η��B<����+�RF+O����!ѐ���zK��)��uf��Kq��8m%�~��(�_��,��NX��d�������-���]�j�И�ºZ�)�WSt�iEc&�� gE|�,���Dn�),*���5�߱9�z����T}�Ҿ���RFf��ɑ�H2�'3��fzh_���m�P\��� DhLE�uB��-Ć��-���+��M~�@��y3�&���%5�)�ܘ��P�r$��1�)��	2�<���`�\X��r�}��r)���<O����x��=_�v�v2s�Q{{�o?w#Q}Ε��� ��I��m�ۨ0�<�JHr����,xwݖ���zn�g�7�{�l���y�7����st��T�O�.�����5����.ٽ��U�+�u��
nC�]�&u&
�{P���aՂ4]�7`D~��{ߴ$���!i)0r�ta
��;|A����샆��eDx����\�?Th^��EOa
�<�e��f�M*������~�X\⢅+��l$1��j�7��g㷬�/��!<6/�v�#�8u��������ؙ�YЕ��s��I�Ƀe�n�t�4m�x$j���r�Cv���i�n{]���8�G��z��:E�y��
.�Re�,��t��d2	�K������H%���.��>VZ��_�(�G���l����!��(��{+4M��7(�}�l�q�r�K2�^04p+J��'oI� 84�!���x�piꖊ���&Jt6�&��f���5?#tⅯ�0�l�>��;%9Z����]®1Bk�
��W�R.^�puF���h�o�l����kœ�K�.���zҷ��Q�2��Bl�~���]�f5�*+P<r�R���$!�jY��+�x��O������B�V�Ӓ?uB� Â�P �{ Q-�`ܥ�=�,�0���������){q����Z�.&#�Z�u�t�`	r�i�~N��T�5I踮��Y��!7��q��<�{�M��:e��U?�{a�g04z}N��9���v`�\���e𵓯��XW((n*
b��d(��%5t��יC�B�t�ڠ.�4&J�4ʃ?k�Y���Q׹	{l�~]wO"�z
�}M�Ҩͦ�){�T�;��8b�`髰�}S�2�Ml�� �qd����j٫�o?sb����:��<��{����7�����CK�g�G�X�[Y^x��mƾO�Y(a���_i�w�r�Xh��py�>J�E�|��ė��/��mZ�����w�zZ�t����Q��7���ET�'o$��eN���5��ᕥ��=�|�i�n���}�4�������*v�      �   )  x�]�K��0F��w�y?��V��A����"���Vz�����,R��E t����}bh���2B�_k�>���Ƈo��������J����f�3\t��{��L�~�_�V�Tߩߚ|�xT}�e�z`5a�wU�t`{�ֽ�l������7�t=/�i~,��Nm�"N���JD�d5�k��{�=����Y#��S�8D�x��}�ӜP�lFZʬ�|a�X#��h}a�z�"�y۸�r�89����p*��~q�S�4�Kk[���@.=���>O?,��a��gkA�#憐��_������L�ŦY%�yԈfw�B��`��qZ@u��8b�ټ��K�bm��-0PX���9E�Z��
�c���s�Q5����-�o��-��*�jQ���Y�GJ��4�2������v��[6O\D��#,t��Vl1���ܠ'�n�����V��-�T�����`*y��Y�T0~�z�kۛ�!�i�*���q"��lye F���!���Un#�+��e���=緅�~����h4�ŏ      �   U   x�r�,K��L.��W((*MMJT0�LN����K-I�
*0B�HI�)2�L,-��c�7�L��H-I�0���љ+F��� ��*�      �   �  x�}��N�0E��������@<%`׍IZQQjʢ|=��ے�PY�z�Ν����`�?X�*��?=?VlNc:��i��m��R��/w_]Z�{�FP�8�����X���hJ��VÐ>�)�j �a�Ǒ#�A�Sh�h�z�y����b��|�o���8N�<��f�='<V��+��Y9�8��,樶�����{ڴ)?ߺ]�Dh�u�9s`5�Y��;(��~a�D0Q�q�t�-�.��Rֲ:K;.�<�����D�������hhZc6����wv!Y
"�\/�C���'�.�N�Y� D��L�5��pi���l#)E6�i����s��"��Rdc��2��t���ː����e��K�GЬ��̀�K1
0,�V���)�Kn����zݑ{3*�+2pZ���N�_���w"BT�s���O     