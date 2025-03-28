PGDMP  /                    }           BD_GRF    16.3    16.3 V   o           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            p           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            q           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            r           1262    16398    BD_GRF    DATABASE     {   CREATE DATABASE "BD_GRF" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "BD_GRF";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            s           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            5           1255    41963    INSERT_rango_fecha()    FUNCTION     K  CREATE FUNCTION public."INSERT_rango_fecha"() RETURNS trigger
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
       public          postgres    false    4            $           1255    25224    actualizar_valor_total()    FUNCTION     �   CREATE FUNCTION public.actualizar_valor_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  NEW.precio_total = NEW.precio_unitario * NEW.existencias;
  RETURN NEW;
END;$$;
 /   DROP FUNCTION public.actualizar_valor_total();
       public          postgres    false    4            "           1255    17144    codigo_alfa()    FUNCTION     �   CREATE FUNCTION public.codigo_alfa() RETURNS trigger
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
       public          postgres    false    4            '           1255    25412    codigo_atencion()    FUNCTION     �   CREATE FUNCTION public.codigo_atencion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_atencion = 'SGC' || NEW.id_atencion;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_atencion();
       public          postgres    false    4            !           1255    16974    codigo_expedientes()    FUNCTION     �   CREATE FUNCTION public.codigo_expedientes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.id_expediente = 'IPC' || new.id_exp;
	RETURN NEW;
END;
$$;
 +   DROP FUNCTION public.codigo_expedientes();
       public          postgres    false    4            %           1255    25235    codigo_imagenes()    FUNCTION     �   CREATE FUNCTION public.codigo_imagenes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_solicitud = 'SIMG' || NEW.id_solicitud;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_imagenes();
       public          postgres    false    4            )           1255    25514    codigo_informe()    FUNCTION     �   CREATE FUNCTION public.codigo_informe() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_informes_central = 'CINF' || NEW.id_informes_central;
	RETURN NEW;
END;$$;
 '   DROP FUNCTION public.codigo_informe();
       public          postgres    false    4            #           1255    17262    codigo_inventario()    FUNCTION     �   CREATE FUNCTION public.codigo_inventario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_producto = 'BM' || NEW.id_producto;
	RETURN NEW;
END;$$;
 *   DROP FUNCTION public.codigo_inventario();
       public          postgres    false    4            (           1255    25439    codigo_servicio()    FUNCTION     �   CREATE FUNCTION public.codigo_servicio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_reporte_service = 'CRSV' || NEW.id_reporte_service;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_servicio();
       public          postgres    false    4            &           1255    25303    insercion_clave_imagenes()    FUNCTION     �  CREATE FUNCTION public.insercion_clave_imagenes() RETURNS trigger
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
       public          postgres    false    4            �            1259    16585    acciones    TABLE       CREATE TABLE public.acciones (
    cod_accion integer NOT NULL,
    fecha_accion timestamp without time zone,
    desc_acciones character varying,
    id_atencion integer NOT NULL,
    estado_accion character varying,
    fecha_resolucion timestamp without time zone
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
       public          postgres    false    218    4            t           0    0    acciones_cod_accion_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.acciones_cod_accion_seq OWNED BY public.acciones.cod_accion;
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
       public          postgres    false    272    4            u           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.atencion_ciudadana_id_atencion_seq OWNED BY public.atencion_ciudadana.id_atencion;
          public          postgres    false    271            �            1259    16572    central    TABLE     �  CREATE TABLE public.central (
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
       public          postgres    false    4    215            v           0    0    central_id_reporte_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.central_id_reporte_seq OWNED BY public.central.id_reporte;
          public          postgres    false    216            �            1259    16890    contribuyentes    TABLE     -  CREATE TABLE public.contribuyentes (
    id_contri integer NOT NULL,
    rut_contri character varying,
    nombre character varying,
    direccion character varying,
    rol_contri character varying,
    giro_contri character varying,
    id_infraccion integer,
    id_expediente character varying
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
       public          postgres    false    4    232            w           0    0    contribuyentes_id_contri_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.contribuyentes_id_contri_seq OWNED BY public.contribuyentes.id_contri;
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
       public          postgres    false    4    248            x           0    0    danios_y_montos_id_daños_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public."danios_y_montos_id_daños_seq" OWNED BY public.danios_y_montos."id_daños";
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
       public          postgres    false    4    270            y           0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq OWNED BY public.datos_atencion_procesos.id_atencion_proceso;
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
       public          postgres    false    266    4            z           0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq OWNED BY public.datos_atencion_sector.id_atencion_sector;
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
       public          postgres    false    4    268            {           0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq OWNED BY public.datos_atencion_solicitud.id_atencion_solicitud;
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
       public          postgres    false    264    4            |           0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq OWNED BY public.datos_atencion_usuario.id_atencion_usuarios;
          public          postgres    false    263                       1259    25441    datos_origen_informe    TABLE     ,  CREATE TABLE public.datos_origen_informe (
    id_origen_informe integer NOT NULL,
    fecha_informe timestamp without time zone,
    captura_informe character varying,
    estado_informe character varying,
    origen_informe json,
    persona_informante json,
    rango_horario character varying
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
       public          postgres    false    275    4            }           0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_origen_informe_id_origen_informe_seq OWNED BY public.datos_origen_informe.id_origen_informe;
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
       public          postgres    false    288    4            ~           0    0 &   datos_recursos_informe_id_recursos_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.datos_recursos_informe_id_recursos_seq OWNED BY public.datos_recursos_informe.id_recursos;
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
       public          postgres    false    262    4                       0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq OWNED BY public.datos_solicitud_denuncia.id_denuncia;
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
       public          postgres    false    260    4            �           0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq OWNED BY public.datos_solicitud_grabacion.id_grabacion;
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
       public          postgres    false    258    4            �           0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_solicitud_responsable_id_responsable_seq OWNED BY public.datos_solicitud_responsable.id_responsable;
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
       public          postgres    false    256    4            �           0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq OWNED BY public.datos_solicitud_usuarios.id_usuarios_img;
          public          postgres    false    255                       1259    25447    datos_tipos_informes    TABLE     �   CREATE TABLE public.datos_tipos_informes (
    id_tipos_informes integer NOT NULL,
    otro_tipo character varying,
    descripcion_informe character varying,
    tipo_informe json,
    recursos_informe json,
    clasificacion_informe json
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
       public          postgres    false    277    4            �           0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq OWNED BY public.datos_tipos_informes.id_tipos_informes;
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
       public          postgres    false    279    4            �           0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq OWNED BY public.datos_ubicacion_informe.id_ubicacion;
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
       public          postgres    false    4    240            �           0    0    datos_vehiculos_id_veh_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.datos_vehiculos_id_veh_seq OWNED BY public.datos_vehiculos.id_veh;
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
       public          postgres    false    4    281            �           0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq OWNED BY public.datos_vehiculos_informe.id_vehiculos;
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
       public          postgres    false    4    226            �           0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.doc_adjuntos_id_adjunto_seq OWNED BY public.doc_adjuntos.id_adjunto;
          public          postgres    false    225            �            1259    16881    expedientes    TABLE     �  CREATE TABLE public.expedientes (
    id_exp integer NOT NULL,
    id_expediente text NOT NULL,
    fecha_resolucion timestamp without time zone,
    user_creador character varying,
    tipo_procedimiento character varying,
    empadronado character varying,
    inspector character varying,
    testigo character varying,
    patr_mixto boolean,
    patrullero character varying,
    id_inspector character varying,
    id_patrullero character varying,
    id_leyes integer,
    id_glosas integer
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
       public          postgres    false    4    230            �           0    0    expedientes_id_exp_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.expedientes_id_exp_seq OWNED BY public.expedientes.id_exp;
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
       public          postgres    false    242    4            �           0    0    glosas_ley_id_glosa_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.glosas_ley_id_glosa_seq OWNED BY public.glosas_ley.id_glosa;
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
       public          postgres    false    244    4            �           0    0    informes_alfa_id_alfa_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.informes_alfa_id_alfa_seq OWNED BY public.informes_alfa.id_alfa;
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
       public          postgres    false    4    284            �           0    0 (   informes_central_id_informes_central_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.informes_central_id_informes_central_seq OWNED BY public.informes_central.id_informes_central;
          public          postgres    false    283            �            1259    16899    infracciones    TABLE     _  CREATE TABLE public.infracciones (
    id_infraccion integer NOT NULL,
    sector_infraccion character varying,
    direccion_infraccion character varying,
    fecha_citacion timestamp without time zone,
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
       public          postgres    false    234    4            �           0    0    infracciones_id_infraccion_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.infracciones_id_infraccion_seq OWNED BY public.infracciones.id_infraccion;
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
       public          postgres    false    4    250            �           0    0    inventario_grd_id_producto_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.inventario_grd_id_producto_seq OWNED BY public.inventario_grd.id_producto;
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
       public          postgres    false    236    4            �           0    0    leyes_id_ley_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.leyes_id_ley_seq OWNED BY public.leyes.id_ley;
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
       public          postgres    false    4    228            �           0    0    origenes_id_origen_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.origenes_id_origen_seq OWNED BY public.origenes.id_origen;
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
       public          postgres    false    4    252            �           0    0    productos_grd_id_productos_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.productos_grd_id_productos_seq OWNED BY public.productos_grd.id_productos_grd;
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
       public          postgres    false    274    4            �           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.reportes_servicios_central_id_reporte_service_seq OWNED BY public.reportes_servicios_central.id_reporte_service;
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
       public          postgres    false    4    246            �           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.sectores_alfa_id_sectores_alfa_seq OWNED BY public.sectores_alfa.id_sectores_alfa;
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
       public          postgres    false    4    254            �           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.solicitudes_imagenes_id_solicitud_seq OWNED BY public.solicitudes_imagenes.id_solicitud;
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
       public          postgres    false    4    224            �           0    0    tipo_reportes_id_tipo_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.tipo_reportes_id_tipo_seq OWNED BY public.tipo_reportes.id_tipo;
          public          postgres    false    223                       1259    25573    users_system    TABLE       CREATE TABLE public.users_system (
    id_user integer NOT NULL,
    cod_user character varying,
    user_name character varying,
    user_password character varying,
    nombre character varying,
    apellido character varying,
    user_rol character varying
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
       public          postgres    false    286    4            �           0    0    users_system_id_user_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.users_system_id_user_seq OWNED BY public.users_system.id_user;
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
       public          postgres    false    237    4            �           0    0    vehiculos_contri_id_v_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.vehiculos_contri_id_v_seq OWNED BY public.vehiculos_contri.id_vehiculos;
          public          postgres    false    238            �           2604    25539    acciones cod_accion    DEFAULT     z   ALTER TABLE ONLY public.acciones ALTER COLUMN cod_accion SET DEFAULT nextval('public.acciones_cod_accion_seq'::regclass);
 B   ALTER TABLE public.acciones ALTER COLUMN cod_accion DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    25540    atencion_ciudadana id_atencion    DEFAULT     �   ALTER TABLE ONLY public.atencion_ciudadana ALTER COLUMN id_atencion SET DEFAULT nextval('public.atencion_ciudadana_id_atencion_seq'::regclass);
 M   ALTER TABLE public.atencion_ciudadana ALTER COLUMN id_atencion DROP DEFAULT;
       public          postgres    false    272    271    272            �           2604    25541    central id_reporte    DEFAULT     x   ALTER TABLE ONLY public.central ALTER COLUMN id_reporte SET DEFAULT nextval('public.central_id_reporte_seq'::regclass);
 A   ALTER TABLE public.central ALTER COLUMN id_reporte DROP DEFAULT;
       public          postgres    false    216    215            �           2604    25542    contribuyentes id_contri    DEFAULT     �   ALTER TABLE ONLY public.contribuyentes ALTER COLUMN id_contri SET DEFAULT nextval('public.contribuyentes_id_contri_seq'::regclass);
 G   ALTER TABLE public.contribuyentes ALTER COLUMN id_contri DROP DEFAULT;
       public          postgres    false    232    231    232            �           2604    25543    danios_y_montos id_daños    DEFAULT     �   ALTER TABLE ONLY public.danios_y_montos ALTER COLUMN "id_daños" SET DEFAULT nextval('public."danios_y_montos_id_daños_seq"'::regclass);
 J   ALTER TABLE public.danios_y_montos ALTER COLUMN "id_daños" DROP DEFAULT;
       public          postgres    false    247    248    248            �           2604    25544 +   datos_atencion_procesos id_atencion_proceso    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso SET DEFAULT nextval('public.datos_atencion_procesos_id_atencion_proceso_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso DROP DEFAULT;
       public          postgres    false    269    270    270            �           2604    25545 (   datos_atencion_sector id_atencion_sector    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_sector ALTER COLUMN id_atencion_sector SET DEFAULT nextval('public.datos_atencion_sector_id_atencion_sector_seq'::regclass);
 W   ALTER TABLE public.datos_atencion_sector ALTER COLUMN id_atencion_sector DROP DEFAULT;
       public          postgres    false    266    265    266            �           2604    25546 .   datos_atencion_solicitud id_atencion_solicitud    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud SET DEFAULT nextval('public.datos_atencion_solicitud_id_atencion_solicitud_seq'::regclass);
 ]   ALTER TABLE public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud DROP DEFAULT;
       public          postgres    false    268    267    268            �           2604    25547 +   datos_atencion_usuario id_atencion_usuarios    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios SET DEFAULT nextval('public.datos_atencion_usuario_id_atencion_usuarios_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios DROP DEFAULT;
       public          postgres    false    264    263    264            �           2604    25548 &   datos_origen_informe id_origen_informe    DEFAULT     �   ALTER TABLE ONLY public.datos_origen_informe ALTER COLUMN id_origen_informe SET DEFAULT nextval('public.datos_origen_informe_id_origen_informe_seq'::regclass);
 U   ALTER TABLE public.datos_origen_informe ALTER COLUMN id_origen_informe DROP DEFAULT;
       public          postgres    false    276    275                        2604    33768 "   datos_recursos_informe id_recursos    DEFAULT     �   ALTER TABLE ONLY public.datos_recursos_informe ALTER COLUMN id_recursos SET DEFAULT nextval('public.datos_recursos_informe_id_recursos_seq'::regclass);
 Q   ALTER TABLE public.datos_recursos_informe ALTER COLUMN id_recursos DROP DEFAULT;
       public          postgres    false    288    287    288            �           2604    25549 $   datos_solicitud_denuncia id_denuncia    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_denuncia ALTER COLUMN id_denuncia SET DEFAULT nextval('public.datos_solicitud_denuncia_id_denuncia_seq'::regclass);
 S   ALTER TABLE public.datos_solicitud_denuncia ALTER COLUMN id_denuncia DROP DEFAULT;
       public          postgres    false    261    262    262            �           2604    25550 &   datos_solicitud_grabacion id_grabacion    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion ALTER COLUMN id_grabacion SET DEFAULT nextval('public.datos_solicitud_grabacion_id_grabacion_seq'::regclass);
 U   ALTER TABLE public.datos_solicitud_grabacion ALTER COLUMN id_grabacion DROP DEFAULT;
       public          postgres    false    260    259    260            �           2604    25551 *   datos_solicitud_responsable id_responsable    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_responsable ALTER COLUMN id_responsable SET DEFAULT nextval('public.datos_solicitud_responsable_id_responsable_seq'::regclass);
 Y   ALTER TABLE public.datos_solicitud_responsable ALTER COLUMN id_responsable DROP DEFAULT;
       public          postgres    false    257    258    258            �           2604    25552 (   datos_solicitud_usuarios id_usuarios_img    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img SET DEFAULT nextval('public.datos_solicitud_usuarios_id_usuarios_seq'::regclass);
 W   ALTER TABLE public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img DROP DEFAULT;
       public          postgres    false    256    255    256            �           2604    25553 &   datos_tipos_informes id_tipos_informes    DEFAULT     �   ALTER TABLE ONLY public.datos_tipos_informes ALTER COLUMN id_tipos_informes SET DEFAULT nextval('public.datos_tipos_informes_id_tipos_informes_seq'::regclass);
 U   ALTER TABLE public.datos_tipos_informes ALTER COLUMN id_tipos_informes DROP DEFAULT;
       public          postgres    false    278    277            �           2604    25554 $   datos_ubicacion_informe id_ubicacion    DEFAULT     �   ALTER TABLE ONLY public.datos_ubicacion_informe ALTER COLUMN id_ubicacion SET DEFAULT nextval('public.datos_ubicacion_informe_id_ubicacion_seq'::regclass);
 S   ALTER TABLE public.datos_ubicacion_informe ALTER COLUMN id_ubicacion DROP DEFAULT;
       public          postgres    false    280    279            �           2604    25555    datos_vehiculos id_veh    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos ALTER COLUMN id_veh SET DEFAULT nextval('public.datos_vehiculos_id_veh_seq'::regclass);
 E   ALTER TABLE public.datos_vehiculos ALTER COLUMN id_veh DROP DEFAULT;
       public          postgres    false    239    240    240            �           2604    25556 $   datos_vehiculos_informe id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos_informe ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.datos_vehiculos_informe_id_vehiculos_seq'::regclass);
 S   ALTER TABLE public.datos_vehiculos_informe ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    282    281            �           2604    25557    doc_adjuntos id_adjunto    DEFAULT     �   ALTER TABLE ONLY public.doc_adjuntos ALTER COLUMN id_adjunto SET DEFAULT nextval('public.doc_adjuntos_id_adjunto_seq'::regclass);
 F   ALTER TABLE public.doc_adjuntos ALTER COLUMN id_adjunto DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    25558    expedientes id_exp    DEFAULT     x   ALTER TABLE ONLY public.expedientes ALTER COLUMN id_exp SET DEFAULT nextval('public.expedientes_id_exp_seq'::regclass);
 A   ALTER TABLE public.expedientes ALTER COLUMN id_exp DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    25559    glosas_ley id_glosa    DEFAULT     z   ALTER TABLE ONLY public.glosas_ley ALTER COLUMN id_glosa SET DEFAULT nextval('public.glosas_ley_id_glosa_seq'::regclass);
 B   ALTER TABLE public.glosas_ley ALTER COLUMN id_glosa DROP DEFAULT;
       public          postgres    false    241    242    242            �           2604    25560    informes_alfa id_alfa    DEFAULT     ~   ALTER TABLE ONLY public.informes_alfa ALTER COLUMN id_alfa SET DEFAULT nextval('public.informes_alfa_id_alfa_seq'::regclass);
 D   ALTER TABLE public.informes_alfa ALTER COLUMN id_alfa DROP DEFAULT;
       public          postgres    false    244    243    244            �           2604    25561 $   informes_central id_informes_central    DEFAULT     �   ALTER TABLE ONLY public.informes_central ALTER COLUMN id_informes_central SET DEFAULT nextval('public.informes_central_id_informes_central_seq'::regclass);
 S   ALTER TABLE public.informes_central ALTER COLUMN id_informes_central DROP DEFAULT;
       public          postgres    false    283    284    284            �           2604    25562    infracciones id_infraccion    DEFAULT     �   ALTER TABLE ONLY public.infracciones ALTER COLUMN id_infraccion SET DEFAULT nextval('public.infracciones_id_infraccion_seq'::regclass);
 I   ALTER TABLE public.infracciones ALTER COLUMN id_infraccion DROP DEFAULT;
       public          postgres    false    234    233    234            �           2604    25563    inventario_grd id_producto    DEFAULT     �   ALTER TABLE ONLY public.inventario_grd ALTER COLUMN id_producto SET DEFAULT nextval('public.inventario_grd_id_producto_seq'::regclass);
 I   ALTER TABLE public.inventario_grd ALTER COLUMN id_producto DROP DEFAULT;
       public          postgres    false    249    250    250            �           2604    25564    leyes id_ley    DEFAULT     l   ALTER TABLE ONLY public.leyes ALTER COLUMN id_ley SET DEFAULT nextval('public.leyes_id_ley_seq'::regclass);
 ;   ALTER TABLE public.leyes ALTER COLUMN id_ley DROP DEFAULT;
       public          postgres    false    236    235    236            �           2604    25565    origenes id_origen    DEFAULT     x   ALTER TABLE ONLY public.origenes ALTER COLUMN id_origen SET DEFAULT nextval('public.origenes_id_origen_seq'::regclass);
 A   ALTER TABLE public.origenes ALTER COLUMN id_origen DROP DEFAULT;
       public          postgres    false    228    227    228            �           2604    25566    productos_grd id_productos_grd    DEFAULT     �   ALTER TABLE ONLY public.productos_grd ALTER COLUMN id_productos_grd SET DEFAULT nextval('public.productos_grd_id_productos_seq'::regclass);
 M   ALTER TABLE public.productos_grd ALTER COLUMN id_productos_grd DROP DEFAULT;
       public          postgres    false    251    252    252            �           2604    25567 -   reportes_servicios_central id_reporte_service    DEFAULT     �   ALTER TABLE ONLY public.reportes_servicios_central ALTER COLUMN id_reporte_service SET DEFAULT nextval('public.reportes_servicios_central_id_reporte_service_seq'::regclass);
 \   ALTER TABLE public.reportes_servicios_central ALTER COLUMN id_reporte_service DROP DEFAULT;
       public          postgres    false    274    273    274            �           2604    25568    sectores_alfa id_sectores_alfa    DEFAULT     �   ALTER TABLE ONLY public.sectores_alfa ALTER COLUMN id_sectores_alfa SET DEFAULT nextval('public.sectores_alfa_id_sectores_alfa_seq'::regclass);
 M   ALTER TABLE public.sectores_alfa ALTER COLUMN id_sectores_alfa DROP DEFAULT;
       public          postgres    false    245    246    246            �           2604    25569 !   solicitudes_imagenes id_solicitud    DEFAULT     �   ALTER TABLE ONLY public.solicitudes_imagenes ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitudes_imagenes_id_solicitud_seq'::regclass);
 P   ALTER TABLE public.solicitudes_imagenes ALTER COLUMN id_solicitud DROP DEFAULT;
       public          postgres    false    254    253    254            �           2604    25570    tipo_reportes id_tipo    DEFAULT     ~   ALTER TABLE ONLY public.tipo_reportes ALTER COLUMN id_tipo SET DEFAULT nextval('public.tipo_reportes_id_tipo_seq'::regclass);
 D   ALTER TABLE public.tipo_reportes ALTER COLUMN id_tipo DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    25576    users_system id_user    DEFAULT     |   ALTER TABLE ONLY public.users_system ALTER COLUMN id_user SET DEFAULT nextval('public.users_system_id_user_seq'::regclass);
 C   ALTER TABLE public.users_system ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    285    286    286            �           2604    25571    vehiculos_contri id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.vehiculos_contri ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.vehiculos_contri_id_v_seq'::regclass);
 L   ALTER TABLE public.vehiculos_contri ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    238    237            &          0    16585    acciones 
   TABLE DATA                 public          postgres    false    218   ��      \          0    25373    atencion_ciudadana 
   TABLE DATA                 public          postgres    false    272   ��      #          0    16572    central 
   TABLE DATA                 public          postgres    false    215   ž      4          0    16890    contribuyentes 
   TABLE DATA                 public          postgres    false    232   �      D          0    17166    danios_y_montos 
   TABLE DATA                 public          postgres    false    248   ��      Z          0    25364    datos_atencion_procesos 
   TABLE DATA                 public          postgres    false    270   ��      V          0    25346    datos_atencion_sector 
   TABLE DATA                 public          postgres    false    266   F�      X          0    25355    datos_atencion_solicitud 
   TABLE DATA                 public          postgres    false    268   (�      T          0    25337    datos_atencion_usuario 
   TABLE DATA                 public          postgres    false    264   ��      _          0    25441    datos_origen_informe 
   TABLE DATA                 public          postgres    false    275   ��      l          0    33765    datos_recursos_informe 
   TABLE DATA                 public          postgres    false    288   <�      R          0    25265    datos_solicitud_denuncia 
   TABLE DATA                 public          postgres    false    262   ��      P          0    25256    datos_solicitud_grabacion 
   TABLE DATA                 public          postgres    false    260   ]�      N          0    25247    datos_solicitud_responsable 
   TABLE DATA                 public          postgres    false    258   4�      L          0    25238    datos_solicitud_usuarios 
   TABLE DATA                 public          postgres    false    256   ��      a          0    25447    datos_tipos_informes 
   TABLE DATA                 public          postgres    false    277   u�      c          0    25453    datos_ubicacion_informe 
   TABLE DATA                 public          postgres    false    279   a�      <          0    16977    datos_vehiculos 
   TABLE DATA                 public          postgres    false    240   ��      e          0    25459    datos_vehiculos_informe 
   TABLE DATA                 public          postgres    false    281   =�      .          0    16731    doc_adjuntos 
   TABLE DATA                 public          postgres    false    226   ��      2          0    16881    expedientes 
   TABLE DATA                 public          postgres    false    230   5�      *          0    16637    funcionarios 
   TABLE DATA                 public          postgres    false    222   ��      >          0    17073 
   glosas_ley 
   TABLE DATA                 public          postgres    false    242   ��      (          0    16601    informantes 
   TABLE DATA                 public          postgres    false    220   6�      @          0    17129    informes_alfa 
   TABLE DATA                 public          postgres    false    244   ��      h          0    25506    informes_central 
   TABLE DATA                 public          postgres    false    284   b�      6          0    16899    infracciones 
   TABLE DATA                 public          postgres    false    234   ��      F          0    17239    inventario_grd 
   TABLE DATA                 public          postgres    false    250   ��      8          0    16908    leyes 
   TABLE DATA                 public          postgres    false    236   2�      0          0    16757    origenes 
   TABLE DATA                 public          postgres    false    228   ��      H          0    17248    productos_grd 
   TABLE DATA                 public          postgres    false    252   ��      ^          0    25430    reportes_servicios_central 
   TABLE DATA                 public          postgres    false    274   '�      '          0    16594    sectores 
   TABLE DATA                 public          postgres    false    219          B          0    17151    sectores_alfa 
   TABLE DATA                 public          postgres    false    246   �       J          0    25227    solicitudes_imagenes 
   TABLE DATA                 public          postgres    false    254   �      ,          0    16701    tipo_reportes 
   TABLE DATA                 public          postgres    false    224   #      j          0    25573    users_system 
   TABLE DATA                 public          postgres    false    286   �      )          0    16630 	   vehiculos 
   TABLE DATA                 public          postgres    false    221   }      9          0    16916    vehiculos_contri 
   TABLE DATA                 public          postgres    false    237         �           0    0    acciones_cod_accion_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.acciones_cod_accion_seq', 55, true);
          public          postgres    false    217            �           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.atencion_ciudadana_id_atencion_seq', 17, true);
          public          postgres    false    271            �           0    0    central_id_reporte_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.central_id_reporte_seq', 277, true);
          public          postgres    false    216            �           0    0    contribuyentes_id_contri_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.contribuyentes_id_contri_seq', 52, true);
          public          postgres    false    231            �           0    0    danios_y_montos_id_daños_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."danios_y_montos_id_daños_seq"', 30, true);
          public          postgres    false    247            �           0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_procesos_id_atencion_proceso_seq', 19, true);
          public          postgres    false    269            �           0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.datos_atencion_sector_id_atencion_sector_seq', 20, true);
          public          postgres    false    265            �           0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.datos_atencion_solicitud_id_atencion_solicitud_seq', 19, true);
          public          postgres    false    267            �           0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_usuario_id_atencion_usuarios_seq', 22, true);
          public          postgres    false    263            �           0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_origen_informe_id_origen_informe_seq', 54, true);
          public          postgres    false    276            �           0    0 &   datos_recursos_informe_id_recursos_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.datos_recursos_informe_id_recursos_seq', 2, true);
          public          postgres    false    287            �           0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_denuncia_id_denuncia_seq', 48, true);
          public          postgres    false    261            �           0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_solicitud_grabacion_id_grabacion_seq', 39, true);
          public          postgres    false    259            �           0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('public.datos_solicitud_responsable_id_responsable_seq', 39, true);
          public          postgres    false    257            �           0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_usuarios_id_usuarios_seq', 55, true);
          public          postgres    false    255            �           0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_tipos_informes_id_tipos_informes_seq', 83, true);
          public          postgres    false    278            �           0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_ubicacion_informe_id_ubicacion_seq', 45, true);
          public          postgres    false    280            �           0    0    datos_vehiculos_id_veh_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.datos_vehiculos_id_veh_seq', 5, true);
          public          postgres    false    239            �           0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_vehiculos_informe_id_vehiculos_seq', 40, true);
          public          postgres    false    282            �           0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.doc_adjuntos_id_adjunto_seq', 112, true);
          public          postgres    false    225            �           0    0    expedientes_id_exp_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.expedientes_id_exp_seq', 106, true);
          public          postgres    false    229            �           0    0    glosas_ley_id_glosa_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.glosas_ley_id_glosa_seq', 4, true);
          public          postgres    false    241            �           0    0    informes_alfa_id_alfa_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.informes_alfa_id_alfa_seq', 43, true);
          public          postgres    false    243            �           0    0 (   informes_central_id_informes_central_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.informes_central_id_informes_central_seq', 31, true);
          public          postgres    false    283            �           0    0    infracciones_id_infraccion_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.infracciones_id_infraccion_seq', 65, true);
          public          postgres    false    233            �           0    0    inventario_grd_id_producto_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.inventario_grd_id_producto_seq', 75, true);
          public          postgres    false    249            �           0    0    leyes_id_ley_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.leyes_id_ley_seq', 4, true);
          public          postgres    false    235            �           0    0    origenes_id_origen_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.origenes_id_origen_seq', 19, true);
          public          postgres    false    227            �           0    0    productos_grd_id_productos_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.productos_grd_id_productos_seq', 69, true);
          public          postgres    false    251            �           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.reportes_servicios_central_id_reporte_service_seq', 5, true);
          public          postgres    false    273            �           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.sectores_alfa_id_sectores_alfa_seq', 27, true);
          public          postgres    false    245            �           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.solicitudes_imagenes_id_solicitud_seq', 50, true);
          public          postgres    false    253            �           0    0    tipo_reportes_id_tipo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tipo_reportes_id_tipo_seq', 152, true);
          public          postgres    false    223            �           0    0    users_system_id_user_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.users_system_id_user_seq', 5, true);
          public          postgres    false    285            �           0    0    vehiculos_contri_id_v_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.vehiculos_contri_id_v_seq', 54, true);
          public          postgres    false    238            T           2606    25415 *   atencion_ciudadana atencion_ciudadana_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT atencion_ciudadana_pkey PRIMARY KEY (cod_atencion);
 T   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT atencion_ciudadana_pkey;
       public            postgres    false    272            !           2606    17020 "   contribuyentes contribuyentes_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT contribuyentes_pkey PRIMARY KEY (id_contri);
 L   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT contribuyentes_pkey;
       public            postgres    false    232            5           2606    17173 $   danios_y_montos danios_y_montos_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT danios_y_montos_pkey PRIMARY KEY ("id_daños");
 N   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT danios_y_montos_pkey;
       public            postgres    false    248            R           2606    25371 4   datos_atencion_procesos datos_atencion_procesos_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_procesos
    ADD CONSTRAINT datos_atencion_procesos_pkey PRIMARY KEY (id_atencion_proceso);
 ^   ALTER TABLE ONLY public.datos_atencion_procesos DROP CONSTRAINT datos_atencion_procesos_pkey;
       public            postgres    false    270            N           2606    25353 0   datos_atencion_sector datos_atencion_sector_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.datos_atencion_sector
    ADD CONSTRAINT datos_atencion_sector_pkey PRIMARY KEY (id_atencion_sector);
 Z   ALTER TABLE ONLY public.datos_atencion_sector DROP CONSTRAINT datos_atencion_sector_pkey;
       public            postgres    false    266            P           2606    25362 6   datos_atencion_solicitud datos_atencion_solicitud_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_solicitud
    ADD CONSTRAINT datos_atencion_solicitud_pkey PRIMARY KEY (id_atencion_solicitud);
 `   ALTER TABLE ONLY public.datos_atencion_solicitud DROP CONSTRAINT datos_atencion_solicitud_pkey;
       public            postgres    false    268            L           2606    25344 2   datos_atencion_usuario datos_atencion_usuario_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_usuario
    ADD CONSTRAINT datos_atencion_usuario_pkey PRIMARY KEY (id_atencion_usuarios);
 \   ALTER TABLE ONLY public.datos_atencion_usuario DROP CONSTRAINT datos_atencion_usuario_pkey;
       public            postgres    false    264            [           2606    25498 .   datos_origen_informe datos_origen_informe_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_origen_informe
    ADD CONSTRAINT datos_origen_informe_pkey PRIMARY KEY (id_origen_informe);
 X   ALTER TABLE ONLY public.datos_origen_informe DROP CONSTRAINT datos_origen_informe_pkey;
       public            postgres    false    275            j           2606    33772 2   datos_recursos_informe datos_recursos_informe_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public.datos_recursos_informe
    ADD CONSTRAINT datos_recursos_informe_pkey PRIMARY KEY (id_recursos);
 \   ALTER TABLE ONLY public.datos_recursos_informe DROP CONSTRAINT datos_recursos_informe_pkey;
       public            postgres    false    288            J           2606    25272 6   datos_solicitud_denuncia datos_solicitud_denuncia_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.datos_solicitud_denuncia
    ADD CONSTRAINT datos_solicitud_denuncia_pkey PRIMARY KEY (id_denuncia);
 `   ALTER TABLE ONLY public.datos_solicitud_denuncia DROP CONSTRAINT datos_solicitud_denuncia_pkey;
       public            postgres    false    262            H           2606    25263 8   datos_solicitud_grabacion datos_solicitud_grabacion_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion
    ADD CONSTRAINT datos_solicitud_grabacion_pkey PRIMARY KEY (id_grabacion);
 b   ALTER TABLE ONLY public.datos_solicitud_grabacion DROP CONSTRAINT datos_solicitud_grabacion_pkey;
       public            postgres    false    260            F           2606    25254 <   datos_solicitud_responsable datos_solicitud_responsable_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_responsable
    ADD CONSTRAINT datos_solicitud_responsable_pkey PRIMARY KEY (id_responsable);
 f   ALTER TABLE ONLY public.datos_solicitud_responsable DROP CONSTRAINT datos_solicitud_responsable_pkey;
       public            postgres    false    258            D           2606    25245 6   datos_solicitud_usuarios datos_solicitud_usuarios_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios
    ADD CONSTRAINT datos_solicitud_usuarios_pkey PRIMARY KEY (id_usuarios_img);
 `   ALTER TABLE ONLY public.datos_solicitud_usuarios DROP CONSTRAINT datos_solicitud_usuarios_pkey;
       public            postgres    false    256            ]           2606    25500 .   datos_tipos_informes datos_tipos_informes_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_tipos_informes
    ADD CONSTRAINT datos_tipos_informes_pkey PRIMARY KEY (id_tipos_informes);
 X   ALTER TABLE ONLY public.datos_tipos_informes DROP CONSTRAINT datos_tipos_informes_pkey;
       public            postgres    false    277            _           2606    25502 4   datos_ubicacion_informe datos_ubicacion_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_ubicacion_informe
    ADD CONSTRAINT datos_ubicacion_informe_pkey PRIMARY KEY (id_ubicacion);
 ^   ALTER TABLE ONLY public.datos_ubicacion_informe DROP CONSTRAINT datos_ubicacion_informe_pkey;
       public            postgres    false    279            a           2606    25504 4   datos_vehiculos_informe datos_vehiculos_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_vehiculos_informe
    ADD CONSTRAINT datos_vehiculos_informe_pkey PRIMARY KEY (id_vehiculos);
 ^   ALTER TABLE ONLY public.datos_vehiculos_informe DROP CONSTRAINT datos_vehiculos_informe_pkey;
       public            postgres    false    281            ,           2606    16984 $   datos_vehiculos datos_vehiculos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.datos_vehiculos
    ADD CONSTRAINT datos_vehiculos_pkey PRIMARY KEY (id_veh);
 N   ALTER TABLE ONLY public.datos_vehiculos DROP CONSTRAINT datos_vehiculos_pkey;
       public            postgres    false    240                       2606    16888    expedientes expedientes_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT expedientes_pkey PRIMARY KEY (id_expediente);
 F   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT expedientes_pkey;
       public            postgres    false    230            .           2606    17080    glosas_ley glosas_ley_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.glosas_ley
    ADD CONSTRAINT glosas_ley_pkey PRIMARY KEY (id_glosa);
 D   ALTER TABLE ONLY public.glosas_ley DROP CONSTRAINT glosas_ley_pkey;
       public            postgres    false    242            0           2606    17136     informes_alfa informes_alfa_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.informes_alfa
    ADD CONSTRAINT informes_alfa_pkey PRIMARY KEY (cod_alfa);
 J   ALTER TABLE ONLY public.informes_alfa DROP CONSTRAINT informes_alfa_pkey;
       public            postgres    false    244            f           2606    25513 &   informes_central informes_central_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT informes_central_pkey PRIMARY KEY (cod_informes_central);
 P   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT informes_central_pkey;
       public            postgres    false    284            %           2606    16906    infracciones infracciones_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT infracciones_pkey PRIMARY KEY (id_infraccion);
 H   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT infracciones_pkey;
       public            postgres    false    234            8           2606    17265 "   inventario_grd inventario_grd_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.inventario_grd
    ADD CONSTRAINT inventario_grd_pkey PRIMARY KEY (cod_producto);
 L   ALTER TABLE ONLY public.inventario_grd DROP CONSTRAINT inventario_grd_pkey;
       public            postgres    false    250            '           2606    16915    leyes leyes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.leyes
    ADD CONSTRAINT leyes_pkey PRIMARY KEY (id_ley);
 :   ALTER TABLE ONLY public.leyes DROP CONSTRAINT leyes_pkey;
       public            postgres    false    236                       2606    16592    acciones pk_cod_accion 
   CONSTRAINT     \   ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT pk_cod_accion PRIMARY KEY (cod_accion);
 @   ALTER TABLE ONLY public.acciones DROP CONSTRAINT pk_cod_accion;
       public            postgres    false    218                       2606    16738    doc_adjuntos pk_id_adjunto 
   CONSTRAINT     `   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT pk_id_adjunto PRIMARY KEY (id_adjunto);
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT pk_id_adjunto;
       public            postgres    false    226                       2606    16808    funcionarios pk_id_funcionario 
   CONSTRAINT     h   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT pk_id_funcionario PRIMARY KEY (id_funcionario);
 H   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT pk_id_funcionario;
       public            postgres    false    222                       2606    16788    informantes pk_id_informante 
   CONSTRAINT     e   ALTER TABLE ONLY public.informantes
    ADD CONSTRAINT pk_id_informante PRIMARY KEY (id_informante);
 F   ALTER TABLE ONLY public.informantes DROP CONSTRAINT pk_id_informante;
       public            postgres    false    220                       2606    16764    origenes pk_id_origen 
   CONSTRAINT     Z   ALTER TABLE ONLY public.origenes
    ADD CONSTRAINT pk_id_origen PRIMARY KEY (id_origen);
 ?   ALTER TABLE ONLY public.origenes DROP CONSTRAINT pk_id_origen;
       public            postgres    false    228                       2606    16583    central pk_id_reporte 
   CONSTRAINT     [   ALTER TABLE ONLY public.central
    ADD CONSTRAINT pk_id_reporte PRIMARY KEY (id_reporte);
 ?   ALTER TABLE ONLY public.central DROP CONSTRAINT pk_id_reporte;
       public            postgres    false    215                       2606    16801    sectores pk_id_sector 
   CONSTRAINT     Z   ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT pk_id_sector PRIMARY KEY (id_sector);
 ?   ALTER TABLE ONLY public.sectores DROP CONSTRAINT pk_id_sector;
       public            postgres    false    219                       2606    16706    tipo_reportes pk_id_tipo 
   CONSTRAINT     [   ALTER TABLE ONLY public.tipo_reportes
    ADD CONSTRAINT pk_id_tipo PRIMARY KEY (id_tipo);
 B   ALTER TABLE ONLY public.tipo_reportes DROP CONSTRAINT pk_id_tipo;
       public            postgres    false    224                       2606    16636    vehiculos pk_id_vehiculo 
   CONSTRAINT     _   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT pk_id_vehiculo PRIMARY KEY (id_vehiculo);
 B   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT pk_id_vehiculo;
       public            postgres    false    221            *           2606    16961     vehiculos_contri pk_id_vehiculos 
   CONSTRAINT     h   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT pk_id_vehiculos PRIMARY KEY (id_vehiculos);
 J   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT pk_id_vehiculos;
       public            postgres    false    237            3           2606    17158    sectores_alfa pk_sectores_alfa 
   CONSTRAINT     j   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT pk_sectores_alfa PRIMARY KEY (id_sectores_alfa);
 H   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT pk_sectores_alfa;
       public            postgres    false    246            <           2606    17273     productos_grd productos_grd_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT productos_grd_pkey PRIMARY KEY (id_productos_grd);
 J   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT productos_grd_pkey;
       public            postgres    false    252            Y           2606    25437 :   reportes_servicios_central reportes_servicios_central_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.reportes_servicios_central
    ADD CONSTRAINT reportes_servicios_central_pkey PRIMARY KEY (cod_reporte_service);
 d   ALTER TABLE ONLY public.reportes_servicios_central DROP CONSTRAINT reportes_servicios_central_pkey;
       public            postgres    false    274            B           2606    25234 .   solicitudes_imagenes solicitudes_imagenes_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT solicitudes_imagenes_pkey PRIMARY KEY (cod_solicitud);
 X   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT solicitudes_imagenes_pkey;
       public            postgres    false    254            h           2606    25580    users_system users_system_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.users_system
    ADD CONSTRAINT users_system_pkey PRIMARY KEY (id_user);
 H   ALTER TABLE ONLY public.users_system DROP CONSTRAINT users_system_pkey;
       public            postgres    false    286            1           1259    17191    fki_fk_cod_alfa    INDEX     T   CREATE INDEX fki_fk_cod_alfa ON public.sectores_alfa USING btree (cod_alfa_sector);
 #   DROP INDEX public.fki_fk_cod_alfa;
       public            postgres    false    246            9           1259    17279    fki_fk_cod_producto    INDEX     U   CREATE INDEX fki_fk_cod_producto ON public.productos_grd USING btree (cod_producto);
 '   DROP INDEX public.fki_fk_cod_producto;
       public            postgres    false    252            :           1259    17271    fki_fk_cod_produncto    INDEX     V   CREATE INDEX fki_fk_cod_produncto ON public.productos_grd USING btree (cod_producto);
 (   DROP INDEX public.fki_fk_cod_produncto;
       public            postgres    false    252                       1259    25421    fki_fk_id_atencion    INDEX     R   CREATE INDEX fki_fk_id_atencion ON public.doc_adjuntos USING btree (id_atencion);
 &   DROP INDEX public.fki_fk_id_atencion;
       public            postgres    false    226            (           1259    17026    fki_fk_id_contri    INDEX     R   CREATE INDEX fki_fk_id_contri ON public.vehiculos_contri USING btree (id_contri);
 $   DROP INDEX public.fki_fk_id_contri;
       public            postgres    false    237            =           1259    25296    fki_fk_id_denuncia    INDEX     Z   CREATE INDEX fki_fk_id_denuncia ON public.solicitudes_imagenes USING btree (id_denuncia);
 &   DROP INDEX public.fki_fk_id_denuncia;
       public            postgres    false    254            #           1259    16990    fki_fk_id_expediente    INDEX     V   CREATE INDEX fki_fk_id_expediente ON public.infracciones USING btree (id_expediente);
 (   DROP INDEX public.fki_fk_id_expediente;
       public            postgres    false    234                       1259    16673    fki_fk_id_funcionario    INDEX     S   CREATE INDEX fki_fk_id_funcionario ON public.central USING btree (id_funcionario);
 )   DROP INDEX public.fki_fk_id_funcionario;
       public            postgres    false    215            >           1259    25290    fki_fk_id_grabacion    INDEX     \   CREATE INDEX fki_fk_id_grabacion ON public.solicitudes_imagenes USING btree (id_grabacion);
 '   DROP INDEX public.fki_fk_id_grabacion;
       public            postgres    false    254                       1259    16822    fki_fk_id_informante    INDEX     Q   CREATE INDEX fki_fk_id_informante ON public.central USING btree (id_informante);
 (   DROP INDEX public.fki_fk_id_informante;
       public            postgres    false    215            "           1259    17011    fki_fk_id_infraccion    INDEX     X   CREATE INDEX fki_fk_id_infraccion ON public.contribuyentes USING btree (id_infraccion);
 (   DROP INDEX public.fki_fk_id_infraccion;
       public            postgres    false    232                       1259    16951    fki_fk_id_leyes    INDEX     K   CREATE INDEX fki_fk_id_leyes ON public.expedientes USING btree (id_leyes);
 #   DROP INDEX public.fki_fk_id_leyes;
       public            postgres    false    230                       1259    16774    fki_fk_id_origen    INDEX     I   CREATE INDEX fki_fk_id_origen ON public.central USING btree (id_origen);
 $   DROP INDEX public.fki_fk_id_origen;
       public            postgres    false    215            U           1259    25411    fki_fk_id_proceso    INDEX     _   CREATE INDEX fki_fk_id_proceso ON public.atencion_ciudadana USING btree (id_atencion_proceso);
 %   DROP INDEX public.fki_fk_id_proceso;
       public            postgres    false    272            6           1259    17261    fki_fk_id_productos_grd    INDEX     ^   CREATE INDEX fki_fk_id_productos_grd ON public.inventario_grd USING btree (id_productos_grd);
 +   DROP INDEX public.fki_fk_id_productos_grd;
       public            postgres    false    250            	           1259    16617    fki_fk_id_reporte    INDEX     M   CREATE INDEX fki_fk_id_reporte ON public.acciones USING btree (id_atencion);
 %   DROP INDEX public.fki_fk_id_reporte;
       public            postgres    false    218            ?           1259    25284    fki_fk_id_responsable    INDEX     `   CREATE INDEX fki_fk_id_responsable ON public.solicitudes_imagenes USING btree (id_responsable);
 )   DROP INDEX public.fki_fk_id_responsable;
       public            postgres    false    254                       1259    16794    fki_fk_id_sector    INDEX     I   CREATE INDEX fki_fk_id_sector ON public.central USING btree (id_sector);
 $   DROP INDEX public.fki_fk_id_sector;
       public            postgres    false    215            V           1259    25395    fki_fk_id_solicitud    INDEX     c   CREATE INDEX fki_fk_id_solicitud ON public.atencion_ciudadana USING btree (id_atencion_solicitud);
 '   DROP INDEX public.fki_fk_id_solicitud;
       public            postgres    false    272                       1259    16718    fki_fk_id_tipo_reporte    INDEX     U   CREATE INDEX fki_fk_id_tipo_reporte ON public.central USING btree (id_tipo_reporte);
 *   DROP INDEX public.fki_fk_id_tipo_reporte;
       public            postgres    false    215            b           1259    25526    fki_fk_id_tipos_informes    INDEX     a   CREATE INDEX fki_fk_id_tipos_informes ON public.informes_central USING btree (id_tipos_informe);
 ,   DROP INDEX public.fki_fk_id_tipos_informes;
       public            postgres    false    284            c           1259    25532    fki_fk_id_ubicacion_informes    INDEX     i   CREATE INDEX fki_fk_id_ubicacion_informes ON public.informes_central USING btree (id_ubicacion_informe);
 0   DROP INDEX public.fki_fk_id_ubicacion_informes;
       public            postgres    false    284                       1259    16729    fki_fk_id_user    INDEX     M   CREATE INDEX fki_fk_id_user ON public.central USING btree (id_user_central);
 "   DROP INDEX public.fki_fk_id_user;
       public            postgres    false    215            W           1259    25384    fki_fk_id_usuario    INDEX     _   CREATE INDEX fki_fk_id_usuario ON public.atencion_ciudadana USING btree (id_atencion_usuario);
 %   DROP INDEX public.fki_fk_id_usuario;
       public            postgres    false    272            @           1259    25278    fki_fk_id_usuarios    INDEX     ^   CREATE INDEX fki_fk_id_usuarios ON public.solicitudes_imagenes USING btree (id_usuarios_img);
 &   DROP INDEX public.fki_fk_id_usuarios;
       public            postgres    false    254                       1259    16749    fki_fk_id_vehiculo    INDEX     R   CREATE INDEX fki_fk_id_vehiculo ON public.funcionarios USING btree (id_vehiculo);
 &   DROP INDEX public.fki_fk_id_vehiculo;
       public            postgres    false    222            d           1259    25538    fki_fk_id_vehiculo_informe    INDEX     f   CREATE INDEX fki_fk_id_vehiculo_informe ON public.informes_central USING btree (id_vehiculo_informe);
 .   DROP INDEX public.fki_fk_id_vehiculo_informe;
       public            postgres    false    284                       1259    16755    fki_fk_id_vehiculos    INDEX     S   CREATE INDEX fki_fk_id_vehiculos ON public.funcionarios USING btree (id_vehiculo);
 '   DROP INDEX public.fki_fk_id_vehiculos;
       public            postgres    false    222            �           2620    25307 &   solicitudes_imagenes cod_imagenes_soli    TRIGGER     �   CREATE TRIGGER cod_imagenes_soli BEFORE INSERT ON public.solicitudes_imagenes FOR EACH ROW EXECUTE FUNCTION public.codigo_imagenes();
 ?   DROP TRIGGER cod_imagenes_soli ON public.solicitudes_imagenes;
       public          postgres    false    254    293            �           2620    17149    informes_alfa codigo_ALFA    TRIGGER     w   CREATE TRIGGER "codigo_ALFA" BEFORE INSERT ON public.informes_alfa FOR EACH ROW EXECUTE FUNCTION public.codigo_alfa();
 4   DROP TRIGGER "codigo_ALFA" ON public.informes_alfa;
       public          postgres    false    290    244            �           2620    25413 ,   atencion_ciudadana codigo_atencion_ciudadana    TRIGGER     �   CREATE TRIGGER codigo_atencion_ciudadana BEFORE INSERT ON public.atencion_ciudadana FOR EACH ROW EXECUTE FUNCTION public.codigo_atencion();
 E   DROP TRIGGER codigo_atencion_ciudadana ON public.atencion_ciudadana;
       public          postgres    false    272    295            �           2620    25515     informes_central codigo_informes    TRIGGER        CREATE TRIGGER codigo_informes BEFORE INSERT ON public.informes_central FOR EACH ROW EXECUTE FUNCTION public.codigo_informe();
 9   DROP TRIGGER codigo_informes ON public.informes_central;
       public          postgres    false    297    284            �           2620    17263    inventario_grd codigo_producto    TRIGGER     �   CREATE TRIGGER codigo_producto BEFORE INSERT ON public.inventario_grd FOR EACH ROW EXECUTE FUNCTION public.codigo_inventario();
 7   DROP TRIGGER codigo_producto ON public.inventario_grd;
       public          postgres    false    291    250            �           2620    25440 )   reportes_servicios_central codigo_service    TRIGGER     �   CREATE TRIGGER codigo_service BEFORE INSERT ON public.reportes_servicios_central FOR EACH ROW EXECUTE FUNCTION public.codigo_servicio();
 B   DROP TRIGGER codigo_service ON public.reportes_servicios_central;
       public          postgres    false    296    274            �           2620    41967 "   datos_origen_informe rango_horario    TRIGGER     �   CREATE TRIGGER rango_horario BEFORE INSERT OR UPDATE ON public.datos_origen_informe FOR EACH ROW EXECUTE FUNCTION public."INSERT_rango_fecha"();
 ;   DROP TRIGGER rango_horario ON public.datos_origen_informe;
       public          postgres    false    309    275            �           2620    16975 %   expedientes trigger_codigo_expediente    TRIGGER     �   CREATE TRIGGER trigger_codigo_expediente BEFORE INSERT ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.codigo_expedientes();
 >   DROP TRIGGER trigger_codigo_expediente ON public.expedientes;
       public          postgres    false    230    289            �           2620    25225    productos_grd valor_total    TRIGGER     �   CREATE TRIGGER valor_total BEFORE INSERT OR UPDATE OF precio_unitario, existencias ON public.productos_grd FOR EACH ROW EXECUTE FUNCTION public.actualizar_valor_total();
 2   DROP TRIGGER valor_total ON public.productos_grd;
       public          postgres    false    252    252    252    292            |           2606    17197    sectores_alfa fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY (cod_alfa_sector) REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    244    4912    246            }           2606    17202    danios_y_montos fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY ("cod_alfa_daños") REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    248    244    4912            ~           2606    17280    productos_grd fk_cod_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) REFERENCES public.inventario_grd(cod_producto) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT fk_cod_producto;
       public          postgres    false    252    4920    250            z           2606    17062 !   vehiculos_contri fk_contribuyente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_contribuyente FOREIGN KEY (id_contri) REFERENCES public.contribuyentes(id_contri) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_contribuyente;
       public          postgres    false    232    237    4897            y           2606    17052    infracciones fk_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT fk_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT fk_expediente;
       public          postgres    false    4894    230    234            q           2606    25416    doc_adjuntos fk_id_atencion    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_atencion FOREIGN KEY (id_atencion) REFERENCES public.atencion_ciudadana(cod_atencion);
 E   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_atencion;
       public          postgres    false    226    272    4948                       2606    25316 #   solicitudes_imagenes fk_id_denuncia    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_denuncia FOREIGN KEY (id_denuncia) REFERENCES public.datos_solicitud_denuncia(id_denuncia) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_denuncia;
       public          postgres    false    4938    262    254            w           2606    17047    contribuyentes fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 I   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    230    4894    232            {           2606    17067 !   vehiculos_contri fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    4894    237    230            r           2606    17123    doc_adjuntos fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 G   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    230    226    4894            k           2606    16809    central fk_id_funcionario    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_funcionario;
       public          postgres    false    215    4885    222            �           2606    25321 $   solicitudes_imagenes fk_id_grabacion    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_grabacion FOREIGN KEY (id_grabacion) REFERENCES public.datos_solicitud_grabacion(id_grabacion) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_grabacion;
       public          postgres    false    254    260    4936            l           2606    16823    central fk_id_informante    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_informante FOREIGN KEY (id_informante) REFERENCES public.informantes(id_informante);
 B   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_informante;
       public          postgres    false    220    215    4879            t           2606    16936    expedientes fk_id_inspector    FK CONSTRAINT     �   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_inspector FOREIGN KEY (id_inspector) REFERENCES public.funcionarios(id_funcionario);
 E   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_inspector;
       public          postgres    false    222    4885    230            u           2606    16946    expedientes fk_id_leyes    FK CONSTRAINT     {   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_leyes FOREIGN KEY (id_leyes) REFERENCES public.leyes(id_ley);
 A   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_leyes;
       public          postgres    false    236    4903    230            m           2606    16769    central fk_id_origen    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES public.origenes(id_origen);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    215    4892    228            �           2606    25516    informes_central fk_id_origen    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen_informe) REFERENCES public.datos_origen_informe(id_origen_informe);
 G   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    275    4955    284            v           2606    16941    expedientes fk_id_patrullero    FK CONSTRAINT     �   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_patrullero FOREIGN KEY (id_patrullero) REFERENCES public.funcionarios(id_funcionario);
 F   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_patrullero;
       public          postgres    false    4885    230    222            �           2606    25406     atencion_ciudadana fk_id_proceso    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_proceso FOREIGN KEY (id_atencion_proceso) REFERENCES public.datos_atencion_procesos(id_atencion_proceso) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_proceso;
       public          postgres    false    4946    270    272            s           2606    16855    doc_adjuntos fk_id_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_reporte FOREIGN KEY (id_reporte) REFERENCES public.central(id_reporte) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_reporte;
       public          postgres    false    4872    215    226            �           2606    25326 &   solicitudes_imagenes fk_id_responsable    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_responsable FOREIGN KEY (id_responsable) REFERENCES public.datos_solicitud_responsable(id_responsable) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_responsable;
       public          postgres    false    4934    254    258            n           2606    16802    central fk_id_sector    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_sector) REFERENCES public.sectores(id_sector);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_sector;
       public          postgres    false    4877    219    215            �           2606    25396    atencion_ciudadana fk_id_sector    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_atencion_sector) REFERENCES public.datos_atencion_sector(id_atencion_sector) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_sector;
       public          postgres    false    266    4942    272            �           2606    25390 "   atencion_ciudadana fk_id_solicitud    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_solicitud FOREIGN KEY (id_atencion_solicitud) REFERENCES public.datos_atencion_solicitud(id_atencion_solicitud) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_solicitud;
       public          postgres    false    272    268    4944            o           2606    16713    central fk_id_tipo_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_tipo_reporte FOREIGN KEY (id_tipo_reporte) REFERENCES public.tipo_reportes(id_tipo);
 D   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_tipo_reporte;
       public          postgres    false    224    4887    215            �           2606    25521 %   informes_central fk_id_tipos_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_tipos_informes FOREIGN KEY (id_tipos_informe) REFERENCES public.datos_tipos_informes(id_tipos_informes);
 O   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_tipos_informes;
       public          postgres    false    284    4957    277            �           2606    25527 )   informes_central fk_id_ubicacion_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_ubicacion_informes FOREIGN KEY (id_ubicacion_informe) REFERENCES public.datos_ubicacion_informe(id_ubicacion);
 S   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_ubicacion_informes;
       public          postgres    false    279    4959    284            �           2606    25401     atencion_ciudadana fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_atencion_usuario) REFERENCES public.datos_atencion_usuario(id_atencion_usuarios) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    4940    272    264            �           2606    25331 #   solicitudes_imagenes fk_id_usuarios    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_usuarios FOREIGN KEY (id_usuarios_img) REFERENCES public.datos_solicitud_usuarios(id_usuarios_img) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_usuarios;
       public          postgres    false    254    4932    256            �           2606    25533 '   informes_central fk_id_vehiculo_informe    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_vehiculo_informe FOREIGN KEY (id_vehiculo_informe) REFERENCES public.datos_vehiculos_informe(id_vehiculos);
 Q   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_vehiculo_informe;
       public          postgres    false    281    284    4961            p           2606    16750    funcionarios fk_id_vehiculos    FK CONSTRAINT     �   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT fk_id_vehiculos FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculos(id_vehiculo);
 F   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT fk_id_vehiculos;
       public          postgres    false    4881    222    221            x           2606    17057    contribuyentes fk_infraccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_infraccion FOREIGN KEY (id_infraccion) REFERENCES public.infracciones(id_infraccion) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_infraccion;
       public          postgres    false    234    4901    232            &   �  x�՗Mo�0���s�������z�!R����^+���bB���kp�Ҥ�jO����1��<x����y�������H/d����R�ݛ�rL7r�˰M��
m���<�v+3u��`�ʮ9�_W���8���1���, B�����q����A�C��w��i�/g�	�Sa�S�/�4aVy�?==��!���e(KD��Js�V�c��H��)�2ʫ_%��
=��ߛ!�y�J�
����n��8��\R��I ��*+�ڢ�j�a	��q�8��:��9��;��wX�n�B���?���Ͷ�^������~Vo�Q�15Ix@"aI~���뜵��"��@��pK�9H<��.p��h���}�2E��qġ��F���{>c>1� �i�0Z�!��狰��v�	��=��Sa!��|j~��<��t�ٜ�k'��C|�`��1��>>.���?�f��pH�      \     x����j�@�O1�$�G]��S�%���*f��Pܠ��w��B�'XA��|��9^��\?�no?Z�t�0*m�Vi�w}7v��}�7����ë�ζ��y΃Z��of�Kz����>5�� ����s�D��y;%;� ) ����a�S�N�]
�W���9vF�j��y�l�ؒ����ߝ;w�n\#'z��p�݉˜�U����K��.t�c>�r��ϝ�>}"�!� ��(�� �w"r)"�~�#�fD��$���hG���܏	��y��(�����      #      x���n�H����6����wzV��̸_`��itAE�l�eR&)� 3�^�b0����He��l�s�(�U���<u�ԩ������{�����0_|��q�xQ�g��1p�~9Ca�Ln�G�Ǜ�x(8a�m��Y�㝏<������ݩ;�����턓��N\�|,95
|��|IH>�|��M��{�d5t&�$�Ӆ\r�풓ҏ��~`;�q��s��:�a:���'&��
�����[w�����n���~�G�Ɨ�f�=Y��}$�˪�Ё,H��<��vm?^�N�ܬY��\�fǷ+^����O�޽�v�_���G�{��vF��&�r<��+1��e0���@6D]WM�P���w38�7��!���+9!9�->��֝�/\/�_�O��0�',�A�c.�Ko���?�\֖���r1�:�5�\oq��<�s�7�݋�phOK�`Z.��?�Rr�v���w�J�*J��ȹH�d��a �J5"�k&�|�08��>9�~?.G'W������m�t���~�����_uU�N. y0\Cl��&��Q������a��z^]xiRn.$s_�).ZRs y �$�Y�8b��F�2��qc��Z@:<�����K)����iP��[\:��k��ivp�+��}uo�ť���wV��)�k�kg�����_����?���7�
0}uL�ŷ�
�-�W�̷4����#r��Q��5�h;�Պ�ߒ����Z�lXZ�mw���;[ؾV�elC\�z�����Z ��Ҽ�8VP��!I��"t^ii���3��d�(��wϝ���-�O�zu�:፿G�7V5Ւ[*�ϸs�`!�rb������6NZ�Ɵ��L��O��q,f3�9n?s�5�t9���V=�muӖBkU���.ǧ���j[M22C3�	��vN*���3o��Kc��͍�h�J;�U���^4Z/r�^��;��:�Jx��yG��s�\
��˪&��F^�{�}�Ƴ9��ķ3�rRA$Y$��"j���Z�kd Q�,I�$+���B��O�|����4�d|'I�k"?�=yZ��Y	%�f��S����M�fU�H=@�4�����dͨ���5���;���Ro]�u�����w��/ �$>ݚ�td!Z�:R�xcW�V\���	��g�ZK�TYmJ�?&\�?�h�'���f�5�ї�f�]��ɶ%<Yn KU���(K����vj���C�|���#���r�l7�ł��"�<&��(K��,���hꢄtIUV�n�P�Fj��� 3}#H���i5�ضmZu����p@�KM5e=��DD�ES]%�'@����dt���(s�'��9�)_���J7�VL�n����S�Q��� K��:<��h��tT���h階L����I��mL݁M{)��Ey)�^��o���4EU���-7U���m��4[Ma����� ����22y��(��%ڨt��2S*�*JS��;Z݆]⥡ǟ �;7�w:�|BE�klcc��Qg���Ee���S~A5�u��l��qܠ���9���g��?|���xՒ����,2m���W��LU��z q?�^�/�� �Nad��#o�L �ڗ�J�<�Z��Xn�ʨ�B[mj�e�)m����ޭb���Gi(H?�J�(e���ˁg6����_������4�ӐTiR�vH�1N�J��PF�eG���Փ,��'F�=H�;��DR+�L� }t�~Ea����N����VS��l�����d��ʃ��-�L��ȶ-�J�#D"ۂ�Ԛ�� � 2Yw�iU�!�-�"��Q_�<�ſ���؟�+�������R���
+��=T@m��s�Ic��L��"`��FBv�Bv���0V]�����=�+�	��ѣb�X��n��fo!����+ցu����4��*�����l� U�/^���/HU��S�/�S䋗���e /�x1{���3�q�ˀ�_� ��/�o���|��_� ����o|��I{#�<�/I�	L+�#��	v �-�{������{D^�����#_��}�+^ī���*�xA��/^�o����xA>_� �+^H�΀A�g����0��4��e���T�<ILe_��bq����3��>�e����(�=\�ф��=3.{�7L��_kK��09f|�W�(��-c��,�/Y� �Ų,d�e2xP�6ԢnA-�7���p�G��Ǝ��=���f����FP�kU��e==���U�Z.��e��Hm̷�E���&L�?p�B��ζj�!��R���`�15�1u*��]>�B�W�d$7=�L0*j�"�G�$`�*'�r�ON�	�ԟ�+��˩2�%h�{є	�&�xA7�x���\�W_��SW��2N���-=Y���;��ُ�ԩNAO�'´��B�<����&����w��tRZ��̈́����Lg7��P�>�C��K��`��x!�>�s)��i�{}�!wW�c�z@=]I��;I�L�(��̚�Q��UL�l^J6w�S���ߢ�e/��ɸH�2A��tA�nN�(�
���*ױ�l�*�
Xwk� �4�%m_��$�q�5k���nc4aHw�x.�p!H�ኗ,�AYI&���Qmme0��m_i�_��0j#�8���L�#r�l�М�6U�βP�f{I$�tw�)w��
9��\�j���Zk��)i����:6q��.t��/�8
�|N�6�����m�riC�����ϧ�јǷld* ��nĕ2+�iT��r ��!�'GrN�]j�R�	�u�g�H�=7�mjh%�G�4�J�D6dK䭲��dgf�1��Ģ֏ga%G�
����4 ۑl����}4�����@��ٙ��@��;Niz��;3g�{�C|=��Q�x!i��W���c��i��ĵ�P�bc�=���Z�,������Wv����0bk��`��m��$�g�A}'B߃��Vz�HkvH��p6��w����g��3�_/hi����������}y`��+^�K�/��+^2�����䋗���]���Y5|�*Fc��}�U�[�C��=3�r�z�=������!}�/HJ)�	�:�*;�P]��,Wx��Ԯs� ?*�V��n~&�X�����~G�Pz��<3dSD����p0�n�<Ud IM��@A���Me\[.�1�v@6w��1�^Z3&w�S��������n�E�����Z�V:0�ڒ!ҁm�**m`|PG5�O;�`�ʁ̚i�(*��R�ʂ�������Ԣ.qt�
��[��3�s�`�DC��q#�=�;3�ݐ�4I������ὲ6�QU�KjV6LQU-�JV�6�P����o7�t0��&��В������=��]�0Yn*��8��K"�CǾs�0r��8�0�g��"�?�:.��+/��Lr"
S,��0��Y2�X'�ְ�[e��ݜ�_8�/=B������,�?s���CI����U>tT��פ��v~�;"��,�K,�l��!�98 ��p����6}�%Z��$b�S!*����ieB,b�f��%{s|2:���S�5F����<���qb܂�]�KK�����d
�x�[;
ȕG�Gkk_VEC�LC�s+�k�b�jZ5y��9hmؾ��v�*Ԛ�p+5��k^ܤ���H��Z����1EYVUMM$Sv�(��s���m���ܲU���"�Y_lU�=:���J�#�ҔL썦��"n2ӬkI�UPb%�\g}�;���S����Y�z��k
s.�Y����j�h��#=&��Ddi�e�* Vr�o����H~[[x�������9����Q"%�!BdB�$S��=�c���,��ȭ��RD�R���)G^SRcWt�H���rtv:z;Lݭ!�����2հԖ+�n�@K�������U7Tϐ���A��GU?���P�$���B T/Y۩4ө".�ɮ�ѝ���;�N�xO^�_Ъ��vF��8��x,
WW"]?7�8��ϊDi��h��ZX�Q֚E�ԡ�dtr� :   �X���>htz��+�*W�bή��_ê��7���z�=��ƌ�_Z?T��ś�#���L3;�      4   �  x�Ֆ[O�0���)�S�d�}2nK�������f�D��*�����@{m����s�Xm�X�vkp)'��YZHq(?iZ��ymnM�,��N��A�) B�8Y���S;̅�ZG=B�Lb=O���B���0/���|���������ha�3Xr������%������2$��S����D����z�|0d�p�������5p~�{������WK�2�q{`&{�#S�XF��V/��L����B�ؑ"�9a�x���<����_��Ʊ���f��c�z�Æ=��c�{�#͎�c��*
\/�[�ꒅqv�@5�Te�EZ�y���1S��28#\%��T]sB��X��f�kkmƭG'�
:�I��1'<�]����ɑ�c�8Ÿ��"Y5�֧�n蘦������n��F�Q���Dƕ@O�o�^�.�Ȫ�G�/�$��      D   �  x��U�n�0��+X^� na>D��@s0`�@�
+��YH�+J�"�o菕�� �+@/�E�\���p��^]~�F���7�o�\��$����!.LY�ΰ���?���s���^�kUJx�eV��߫ʚڬ�X�Z �ےC�����������
��9��l6o}�?�֣�L�����F|��������'8���uѤ;c�|�le�l0�t�Pm���S�Qi�]C������NUZ��/�[�"�T��<l��`����V�ݬ��E��TZÑ�{��CF���ε��*]���ԙN���<���*�k�_�3��^4
�\E�͎��tAy0J��X�}���F9�?x�1|���c�)>/�M4]������œ1��p��N
���#~%�!�Q(�^�$|1�f'�9�;B{@C&��Ṻ�ٍ�-�bH2��6;-
_'��mP�ߺ�<F����A{O,�	e�)n)g/��f-\�{      Z   ^  x��Ao� ����w�&u)Ԯ�N;x01�L��<�$
MA��W�����X/^��7�/'�+��W(�۽���7h�̄���R�JCW��h9�v�Ѫ�)̑���A��H�u���ힻ�gB}d����6��y��<�֓%tI��lBP_b��)xZ,W�{���{�L�������2i�}+(Ӛ�F4�G�O):�F�(�)���n�PC�A��k��͊aS��+Vˋ�OCGI�
J�*~� Y����GÆx��4/�� �47<���A��5�GL�j�c�-������2��'���g|�+q��D���Z��!����-.&@�qL���>�N��#��      V   �   x���A�0���4�EVt��A�����.d]}�� ����a;������'YH�b��j�
��/�J͕�e/�5J|g��$%fx�,j+��?��T�^�޴��.�Ҧ��y����9��L�Z8���g���t�O�^�~AZ�$��H�W���A��(.� ���]�9����[��|	�vN�?Dͫ�^s���5A�~�@�      X   L  x�ݔAn�0E��»����j���.X E�J�6�0�8�Ƒ�P���M ���#9V�=��4߳Xn�o1[,�+�����*e�x��T�eŬ��3�C3�f���ZV���N�{��1C��Z�?+qS�B�4����h;߰a8fA�U
*�^m�`̖�(���߃<��/ O}��djA ���ɮ�{A1�nI�2A�}�$���<;�Zvځ$�H�>�`��~���M�$v�%	���g�	Ox�y/t~0>ɗ��n��:��a���K3�{A8i�Rꚧ�Je����N�9���C��m�!s�X�/��� ߟ\����En0�����      T     x�ՔAo� ���
n��1E����z01v�vW�
��A���Yn.ˎp���@�'|yY]^k���ܗv���Z��Lt��2/T���~�!�U���9:j*4�f�R��i'�b?2��u�o���R��+�R�K�r�j��V�yrG���'��S��3�����jHp�v��O��ut� ��?P���?��cb�)x?l N3|$'�Fbz>���T�g��*x]X�*y�&�D�bop�#�~���u|�}u�_�bv�A|�s�z      _   �  x��ݎ�@��}�	7�&��Oz�n�0����ޚQF�3`o�>L��/V�a�nM���00�s��c0����`0z�֛Y��<�h*����R����V,�����9_��m�(�����k�"��0N��r�*W���z×��1�m13!1!���������>�+z�H��.~�y���;F�g"0\�+>�C�dd�<z�|?���ý�'�ZmČ�B�߁	s�Ӿ��4$�AZ)HJv ���j�$�8������z�D$����b��e�r�x��,D@H��cX�<N��� B�1̯��� ��U��2﫯��͏��;$�JvLc�������J0^c
!���r�;b�����qtƑ8";[�V}�T�����#����0z����̾X˜���ؚ(�n��)���0FZ��L]�Ҽ����v޺�&Ah���<j�� ��NĊ�ot�u}�V>i,?=��{�j�jh	G�뱕U��g+��kl�T���&.��9I������!f�l�Hj��Κ����:%X����z2�G���߅��VHf�^>#P7�å��b2�f�k��t��HD:qS���6K����Г��Ʈ�]IM˽�L�[�?ز��      l   o   x���v
Q���W((M��L�KI,�/�/JM.-*22���rS42S��:
0��B��O�k������z@bIQiNNbV�B@QjYj^IfY���5�'լ1B��7��l rE�      R   �  x���[k�0�w?Eު �\Z�=��Q�y������i�m��ۯ�"��|N�7������d1�/�x��������Tm�S��9o6��>�f�����.��ˌ6]���Х����F��]6Y�q��<��(�$Q�vYp�y�A��*@#j�OjPg���¶���Qb�zڸ�̽��{+�!��Cd������O��NCh?��6eDeD�C`����l6],�����H�ޙ49�~���^��\
�"D�b]	�<T)����xBg��Iz��C�t�QSG��@��ʥ�V�s�h�2J�]]�� werA��l�&I���t$ZW&i�=�ڐ�Y}���+`��Q�8��%�VC�(EdR�L�IC*I��$N&	2I�I�L���bpB%!�Ӿ8�9�Aj�~c��<      P   �  x�ݘ�n� ���ܥ���;M��M�E�(��t����6�.�F}�i��ہ,i�h�]EJ����p��/�f�+4_��Qݬ+�}b�*�h��m�c��fBIt*�ƈq�iQ����c�󬤏FH���
�	ͳn/�3��ᝌ>SM��k���Gg��������c��_,��}��d>(*$	�*��~܌�K�ƛ��w6�4l�K��U�H��0M_���CL��08����n�˂N���pz��q���U����ݦ9+(����n�G��U��S��G�$��Mb�^H�¿���^�����3:@��_x�%?d�.=�e/��Lp	�~x�.��l�ޣ��G���ԛ�����Ǥ}��>,o�ϛ���S�aEǻ�ֻ�����y9�z䋐C9N��}��,ݺ�<�ۛD!���l��o�Uk�#�ܟ�����ƾ�������;}�&��x∓i���Ï�H��3���q�LS^���"K�f�ɴ���G��Q.�$a��۷бC�CLd��w��v�!u���[�� 8�?npL'N���΢�@�9���eSP���)�V4�=tڿ����N�Դ�k�2���T��zC���ak�F�JD�UR�w�Tk*37�ij%D�F��9��Y3�����IiԀ)�&p�[�Z�LTQDkѱ(�
���2ZU`I!�l������3������+�      N   N  x���Ak�0���lA������C��c�%6V6��}��T��֋�]��$������#�0N�Pwy%�+�[mNF�ϲ�ĩ)L���yU�BN�(}͛b:&�i��g��M�޾]��>�	,<�,�n�����y2���[�h</�<d�-2��'��@W��\ �y.^����㥍w�ޏI��6�[\\J^�(;\�[��-k^I�Eo��+ثV+9���Q�y��5%�������K���������Y�s��t�С������-?��i�,si�=��	�.gi}�����:lq�i.��lX�_�W9�9�=!�
��[��5�%      L   �  x����n�0�;O1��R���NB��z@B�Z�^���4R�8־��t�P�J�3+��ͧ�a��������3ܾ������;k��zpj笓}m,���dW�U�.����z7|Ne7�:��{�umЍ.Mg���]+��t��<�^�6p���~]�Bd0{?~P�����!b�'���Q��T "�x*t����`������/}����,&+K��8Y�8���wߦ�ʠf�4YMVN��D�,�����٢vML��W~Բl��e�|�S�y�U�<�dYI���/ƃ�".�����������r�'�$�+�1�����&+�WK�����������5��1�^|0I�#�U���F�ʾO#)'յ�^�`׾�Q�~v}@I�i֘�����!����?��'q���q��g^��ol�A�bqǢ��A��~Ϙ�G�A��t�C���m��i%�I�E����?Z�B�      a   �  x��Oo�0��|
+���b't�n��c���2MӋ�'�P;	Ӧ}�~�]�b3���i�4i{��'���<I`<��xCƓ�wd�O��/#�R�9�K��I��0�'��M.I3�n7�$�k��2M�.�|�_ӂ�������Xr��vB>�_�^\�^�w����n����r�\G�T(��'\F"Ʉ�{�3�w�6����qldW��].��KP�<�j�]T ¦5���۠�#Y�0ۡ�"�dj3٢���e� ӹR�E�+-
K@���c��8G;N���<��[��R����� 5�e���9D���H^�VZV"��i�\({�D$D)��@�럛X���6`%C͢xv��?DxjOs������c,��~>����;nw+q�����kPmk+��;jq4�����չ��.܇y�*��To�Q��`�Ry!���	�`�Lr�~=�v�;�Ե�а��xrh��W;�+�rz���U�H���^#t�]�y��I�z�`GK�t&n�����Ӏ����`�C���6�Q@ω�sj��qda�j���T���7m�s��/��	�5�ʝ0��7��<M2��B�롦uU�V�|o4�7�-�-�m�6��4��=@x����F(^�xm����F(^axm����F^axm����F^axm�ᵑ ��xm$�k#^	��H��F�6൑ ����߫�c�G�a��\%|��YZ��      c     x�ՕAK�@����^��"�l��'�R�
M�Lv��wu��A��&�P�x	�������L��2�}�׶������zߖV�����;��b`b�o�������Q�?����ݪ����y����h��.ϧ�Q6Ü Â ����?�;V�aKv����
KS�%��Na;�0�^+rT��o�
��G�E7�nэIy}+N�b���C�ALL��%�$I�G ��P�5��I�4��ғ]�$6�(՜ �H����$�/�i�(�[�-�      <   �   x��ͽ
�0�ݧ��
RȏS��b�ڮ%�B��?}�ƴ���tρs�D�T�D�^`\�F�C';?��K���2�m��E���ANJ�c�޸���S���V5������%��E��f��b~Lğ}|�>�|�>��g�g��g�=||�>�|�>��'�'��'��O�D�D      e   K  x���v
Q���W((M��L�KI,�/�/K��L.��2���rS42S�:

tJ�2Js�JRႚ
a�>���
Ʀ:
���Je�9��JVJaANJ:J9�I�9@.�8����ԤDC��XuT@&H:J�K�2�L@4��<��##cLa�RJ*̑FX}e��W�
�A.���	�|�?�ty(`I���C�x�������S~�>>��6���f��9]�z�r|�C�e�e'#K*�[��%n�Fd��z�v��f���pmFci �V�x�������3��i�|�3�S.Y5�p�*�A_*Q��F���� &��      .   �  x����n�0�{��wK#ő�o�4Q�tJ����T-����{����$��I�v!ğ����l�/!�]^@��<�q^��Y�ЖM���"?���Κ����>�����vu�n���}�]^�+�iָrUT����*^�)�`P<ew��@�`v���~��$���s�=:x D�57Vp��f�۬ڼ"�U�����|CeQ��;?zh{�j��V�Ϡ^��&�I�G�o{�n�r�_(6�=��/��;i7���n뛂�P�+%{~q�/�Ϯoд�}�BÕ�$��+���U�XmB(O(C)�*�bB��@ ���P �<�ni�*����ǧ2�#W�N��
*-ZI��h�Di�2��]M�I4���A�=+�+UK�ڐ8�4��sXD3�<b�\�u�g�*�2�����J��~�퓋t�W~&����W�Y��D���1���D����o_g ��\�$�����> S�G���d\��,*�bѴ��@�v���Ǣ���Y��]�>���.��Ԑyw?Lέ"�6G�T������=���+ %l_�;� �0A*����uJ���ƒ��Y����m��L��*�@9fz̸O��`�!��.2���E��0�Ǒ��O��R��%_I_�5Sh�fF�,�OP|���աk      2   �  x����N�0�{����0%����Ն�T	AE��VnbJ�4���`ﴫ=/6�=�)�iwpzAڐ~����8]Nί�0��^AV-�8�$�3�2-e�q4ׯ-�lq�72��\*��X�T���a.E�r�8S�,W�~�ʼGY W��r��#��E&�r}�,�x��e�������U��\���v�~�쟉|����2Q�(N���������������,��]\��?W6s��h���h6 ��f�Y`��l�Ov��q��m��~P�o�"���慡3�����l��y� ��̾�n��q�7����b1�:,��q��	�V%bM+*��k+�`��}��}wc�w��zC��kQo�����t�7�^'��i�l����@oDR�<�m��P������]Po�.��i� �* T)�g�1��*P��z��w!��,X����	M�y��Z{4��m[�65�l��lIH+y�ȯ�G�N��Dl���"Qz G�N�XHhp���	�=���Ch���1Bk��I��������������	�=Z{4L��<�i4L�A{4�K��&�A4L.%�h�\J�kpp�m��L%]Qk�5R.���j���	TY$JI�͈X{.�h�\���3�VU�n"̈́j�@e�|
DQϧS`6�]^m�f<��Z����a�ٝ�zz_3��>'���a��{�����Ϲ��}�>�Y�*XI(��}?�6�r����=�W�)�2p'�e�%���TB�,�T�=�|�����p�G�Am�Q�57Z�r|O86�o[���,��ۂ�=�6�y��n}R$�fK�ͼO�o��YL> �7_��>ڳYҺ�Wޅk?-ܰ�[jĆǥF��"�u_u��σ��n��h��h����r���ã�����      *   �   x���M�@໿bn*HP~��$1Y?���� *���[�C��q����<�.���C"p���j��J��mҞ�(�v�
4�l�-�^^�(*����}[�ZTH^선�9ndd6����Y
cv�K~�|J���Խ�b�˜�����Y$�F`�?�,f�/R<LG`:��!�5�ʴ���_Be ,cy����iF3������I����      >   `   x���v
Q���W((M��L�K��/N,��I�T��L�su�HPS!��'�5XA�PGA,�`��i��I�QFp��(5�n�1�F���2�� yG_1      (   �   x���v
Q���W((M��L���K�/�M�+I-V��L�G�u��%�9�i�y��
a�>���
�AN�:
�pe
)�
E��I�
� C#cS3sKuMk.O�[n��f5X���������d5 cON�      @   �  x��]k�0���+Do܂["�i�쪰2YM���9��D�H�d����(��|��u�.,[�HV�s�F��2=� ���]	9Sz�M
�ȹ�֕�0U�f�˒�SI#�R��0�q�6Vh�C��u#C-
&��f��	t�����B��J�A���h�vF�Tȕ�-Ӑ)��+�-8�Trƍsp�
�uޚ��rS��jj�^A��5�P�\g���.���˂ٞ���>ލ�9�$��˨%AHF��au�\��vOgO�&��H%��?�u�������/���v
��A��Bӂ-J�ɔ�K%�^i�����><�:>�>�:���Dk&��"��V̂�����D�)���72Inq�R(gw�8��q�tMRH+��{��J�JqKpK�ĭC��&��]quWܑ|Iq�.��}����PU��_Vpͱoz7[%��|
��o�_�	#�v'��pj�x��X����r*�����TE�i���3�0&]d��L�dKc$^c�x����}�6Acx*���1<��0y��Ic�$��S���XK@]�ʮ��E���z���dt�������J�i�$~#�JF�u`w��7����h��2�l���a�EwE�	����l<}�����.�9���h�������xh�~2_��      h   M  x�Օ�J�@@������ ٙ�d�'�
�`���ƨ1)i����ي?0�G`��},̫���q��z���ӡ�͕�_��=횶?��N-����0U���4F�����{t���t1���7~�<�پ�f�������z��ڤjq[�w�,R6W�I%Eò�%�<�H��Y#'�"�J�(X� �K�p��H��($i��Q�f�	Ҁ�W2��3PJ�Ь�I"2I�@�%i k i�����8�I�8P��EH�8pŁ*�e���W��FϠ��W��fPRŁ+Tq�VQ�|QRő+�Tq���5h�J�8rő*n��]P1a�x�|	;�      6   '  x�ݘQo�@����O���pg�i���6-�k3�`i,��f�B��Rm��50�h�9�s����7w!���_l�]���k�%���4�t�.��i�0f��6y�[��B7���DG��)J7jw����Tq>f����o������������S�m�%{�<�ܳ��C��~�m4#���S.!��f�?\i�b��	����$۬�Ju�/B��"���B�\b"�(�~Q+m*G�WP�_���ML>��c���6�i�y�N�w���WJb�EPh��*ZZת(T��m�J�V������~�%�m�^�y0�:��"[�M���14��������ADb�_r���d��<lW�Ϗ{��ͮ�˺�&6{�4�C%q��I��2p|	����Uu��	��vO��֞ ���u�/T��]@,�;G�;��������t�r�k¦��٣fw�����L-��'�(��|���tF3�IJbn���aJ�X����(�ekW���ZՁҴc�<e�uMk�`�c���]�8��X��x��#�'8>c8Gl�Ԏ�zjLh4�jx��      F   ,  x��Y�n�@��+tK�:�>�]�=5@Rh�`��U�V ��W�+�c�.mɒ���U�%A0�!9�n�7�����}�Y�̣���-Y�M�/Yy��Z�&Z� *��6�<2Q^�&A����͝$�$��SeS�[m�3�21qQN�4��f{:	^ˤZ�_E{���e������!� 5	ί��:��G!�?󧻻���k�	���J���������������٭W�5��]� ��~���[Ԋ9���O�(_{X�&5U\"@��v *�.0%ާ=�`s=�+N��hDP�,�HPt�.ݨ��-	�<P{j��-rY�VY���(��D�B���H�~���r��;̦L�nv�w�|�#� ��6{!�\���S�_t�ޡ��J}�K��}����g�9���w�o��/�z=������C]g����P���Vd�Tc�c�w%OR�a���Q���j��W��r/��NyG���W�H���.�.�e��.xΰK���]QqWaC�uu��T�#������_��B5kS��,�����?�k�{��}K������0�o��T�5��s�����V˖vsB�����C�4�i�i������8T��-zǡ��6��FY���7'p?��G�}lr��zn��=>�=��x�����=�����5;�T�F�z����.�M�]l�9��k���; �N��E�dnw#98���2Lyg\tB`�nd?�U�]��l�4s-ߕ�,��VX@-����
��	`E�À���@��^N�E�#� ~��`~����8ggꬿ�      8   X   x���v
Q���W((M��L��I�L-V��L��t���B��O�k������:P@�D]Ӛ˓4��P��d�5��5"C�!T�!H/ s�F�      0   N  x���KN�0��}O1;Z�B(�
m@��CI�-r�i5(�+;��8�G���`˰���2��w:˓��tV�a�U5�S�h�=�i�||��9�2~Z&9��!��ۦr�?���?B���S)ufʒiK�˃�%�(
M�Tz����D'���5�!M[UK�k:�����oE�ް;�5�@ӎDC�2�������BF�7<�L�+�:٬����[������Q(#Of�"K&"(���鸘g"*���ӥ	a,T뺺V/�;^I�Y�:��N鵕���]C�c᭩:/ܓK����z�B��cC�������ܢ�Ȝ�d8��E�^���      H     x��YMo�@��W�D�"�A=�&R�h*�!W��7�Ɖ��4Ϳ�,k`0��4ر1
o�̛��n��ݓ����X�*��rQ��2�e=�U9ϳi�ND�u�j8��eDjS庈Hf�t�hD�/y����������ּ���#��Y��2i^N�VW���-�..��p<��IΥ�HO��l����ALHg�[����vW:{���u�]�`����/g#D�%���Y�Li$�}2�'w7�
�v="�R����},�� ��xS?��2$��m�w�p�s�a:�ܓO.��l:7��0�:X\*���#�C,$���[�cD��=�'ò�N�*�G�M��xѱ]�癮9[=��X�cd�����#�oE�A�N��v�o�n�>�&��X5$�̽�]�WS���̴�=������7���^ �yŏ5lA�7X8y>ښ� Mb�H�t�#����v��S��'u��Mj'kpR̛t!�C�lW̛r�ʘKq��=(b�hj��ӱP�{�/���ʷH�8� G���ݞ�"؃v���<��Qwb%O/dg!�� j���}i�q�o�ǧ��481h�>�_kj����2ޛwS��X):̢��8EԹǋn�v� ��z�fi8n�n�,�%;%�;.�e�;�~�qy��-�:���Z��`(�M8u+J��[axPi�����A��H�k긋d�p4>k�s�����Ÿ��`�����Mo�cޜ&|x�����w�*y��O���|^�O�m�o&��7������X      ^   �   x�Ց���0@�~��҂]b�K{(��Aj۫�1j@IL��uv#���40����(���b��;�J|9h3J[Yi.J(m+!ϣ�=,T]�����~):>��u�(�.�S���Ȩ�8 ��K8~懴�E�ڕǈ�P��U^n���b/Ob�Q��h�b([�xM)b�����ܴ�[�&�b���N�urg�X'��O~9���=�3��셨s�vZ�Ap�k�w      '   �   x���;
�0E�^��N6�l U\�,;�}
����� �������Ǝ��,o8�ۓ����̱@������9D
�t䭺�ѧL=|�u���a6O�@Ȍ䱴h[�!���B�õf2��H0U���+��T!�cyLm      B     x�Ք�J�0��}��u��l�U<�a�R���kI�(5)i�{���/fRuUV����L����O��ڔ[Ȋ�-��鐟���P�����K%-�Q�z�Qrt%��tg�Zp>��Um��5��ߦ�a��w�
fi�.���7Q����᠒pPi8��w�x`ҨÓ�?b4>�&��܈O��=&�^�4��U8���-�C����C�$��%$�o�^[�0 >�+%S�]�NYuL��t��WI}XZͺQ��(�^ 羝-      J   I  x�͖�j�P��~
픀(����Yu��u�N��-� ���=�:�Q� g1�>��|���='�����}ڿu�o�p��>�c;�v�S۷cr�_o_d�a��x�r��������v|��ٿ���ӹ�7�n�OǶ��C��'��o^w�]Ȓt����,qe�l_6�?�Vk3��[���̲�3k�~�Q�A�jf����%�k=��,le��.�i]~�i�]Z��nQo��+����b�V�VX��zq�����b�V-�¢
b�V5�/�[�*2�4Y��hUen�2Xl������ ���z�V.��{�x[�ke=++O�c�-)xm�g[E�g��#൨�E���x[���.	Q��/m���n-a7�9�-P�Y%즛S�Յ%\X�n��m��n+a7%F�-P�U�Yv1b����Ih&��!Fl|Q3	����[_�LB3��,c���W3	������(�L���~�1b�LP3�f��ϱe&��@3����[f��	4��I�2�L��P�M�����f��I�2�L�������-3A��)��I�2���? N=�~Ѓx�C�S���j�`!�8      ,   �	  x��\KoG��W��1��(�������±���k�3Ӥ���l�4�ҿ�1����?�U�Ce;�.���V8�j�����1�|wsq}+.��^�6UF��w��?��Щ(������ѨX��ڻ�	i��qw�������hr"���Z�Nm�Q;��V>���Z֝�M"h7����]��-��N[iN�j�T��i^(�V���b�����1)��fX�����߈Rnm� �WS��ڱ8�C�����^z��Pr�dƤ����޺B���I���<���$�$��O֗��lDK�6*vz��[u��dd(f�Y �e��Q"���p�Pf�k�]{n���\M�}:[&a� �?9��h��
����� �Ū��M�c���C���<�����Eȸ/w�X �S!H�$��E΃s֔����`i��u|-C��/�I����P�Lڂǖ3 ���k:�����. �^�]�{�M����'�H��ţz`4�N��ȴ��V[Z�o�ȩ�U���TMH�՝�®`�#������V5�aF�8o��4��v|�49'<�0J]T$�pi7�x��J�l�O�1��"RgҶr�-���.�ư�Ŋ�w	�,��H������#Dp�Gq�c���鈏e�z�/���x�_k�9����d��?��&�N��p�)꥿���r����;������֮Um����v� �6�P-����+qw����|�9��Ż��`7��Z��Dq2u�l9:���h�P^q��i�F[�H���X3�������Q�4F�>�@A�bR�B�l) <��t�n@�)+л�7A����Q%� D�> ܓ$�ӄ	z�9��|��A��Zo�Q�=9;����¥b��A���{/EX��q|�o�v��t����U��R[� ���� 2��{�,����#|�@�۟g䘬��N��=U�s�)���f4�o�A�����AqwJ3��� ����,#H���e'3J0^Q�D'p�[���A2��)�����&L�L0�BwAc����SgQǎ�D�etJ7^�H��}���:*��\��h���
<^���'��A��*��q�@�������"���M�,ڍD���,�!�5���C� h�X����4����;;�t���q7�~�G:lP ���;�V��Tw�:f^f&3��;�=%�����V��&�GnVTj�u6%��,�$3s�tnj����Z��2
�N�a���yqg�J��3�ԅ�t�5C���G����!K�#)K#���(�i����:d%M�G#�ٯ!y���� ���5�!E�����)AQ�'�N-�U�0�x䇝P�5Zz�!��Jrz�dd"& EĂ<�M���Ϟ 䡖[e� C���ncr :�5풺qp�P���'�k�D:'����5����D �1�<���5�H�7x�1'N8p`��R���O��B�ƲO>�����62�o5@��`f� oR�)��ݛ����Fm@.�!�G��O�W����cԶ��Z��2]�8V�變%�C���� ���k����k�*Vz�#�]U@ap���8�Αޮ��A���gj �z�pk>�bM�9����c۠�@X��9���zC ܈�qW��:�:������M_�l��-��u�2��̾lʩ��A�GߏF#v+��
�l�d�z�͟:w��!���.�ܫ�^�� ���0���h�U?�����A�U�]S�����Z��BER;�p��U{�:�~�nѸ�H�[T�)���i�.�U�x�r���}�̨�!_ ��
Ҹ������U�����r
�r�<�U6��n�"W�@����"��&� l�x8��Ed��8T�b��L�ȵ�Z��P��\RuL�~+'��T#�'��jo��P�N[������ >�}2�W'�웾�Yr���^`1-��l���r���z
�@��]	��g��sE��{�uH���N�xe?h�#��2��ro����>�� VT�ui����Q�X��*�zV�z7�N��c_�M%�\Vʮ
��
	�6�.w}��v�	�E�WE�+䰟b
�PϨ�A��=Z+d��}�PaN�M>k�簛��v�uX�C�Ѻբ΁]���T����R�&�wV>��n���{[vu�Z}��>(��8��n>;�/p�FH�wɸ�)~�/P��}��0��o�K�<�DE��0�j7��"O�NsR�E/���y,�P����A��ҠSث Y���/�d����(�kȠ\�g���9��F�!B?qB�Z6���g�pz��<�B!R���I��J3jE�Ђ���=�N�����`��T����z��NmT_� �8����X�k@%-�<o��9U~J�A�3�Ϟ�N��      j   �   x���v
Q���W((M��L�+-N-*�/�,.I�U��L�	�($��X 2>/17�,H,..�/J�Q���M*
'���d��C��h*�9���+h��(��;��)� ?G������,����r��)��y��\�tw�ѐr��r�1µ�Ļ�� Ӹ֓      )   �   x���v
Q���W((M��L�+K��L.��/V��L���t��̂|M�0G�P�`��� 'uu�����ԤDC�`rbnf~^jI���5�'�l3B�.%f#X<��$����,����Z�JM�LpXwtY�� @׌�      9   �  x���Mk�0�{?EniY�_�i��ɜ�ݵX�4��e�}��D�b���`x0���h\�|��+�׻�F�_ɁFu��mĲ��`Zќm��|�Evu��s��������Ln ��;Ob�dU2��f�S�ysp;�����	�U�Y�k'����i��i+�|��tt>7u��'յ�P�S��8ְ���ၥ|��s��H}Z�a����u��3�}_�H�:���ҩ���J�v%t���f¨�%EU�����2V�%�s�M�H�`��2��2:��Ĵ��%C�RKSJz�-CL}p&��"���7���J���Ě���+�F��Y�I������o��(�};���q0�z.��"rܓ��w׉���܎'�p��{�xy��q�5�=�Hw�隐O&����     