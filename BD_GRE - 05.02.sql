PGDMP  '    $                 }           BD_GRF    16.4    16.4 H   a           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            b           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            c           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            d           1262    32790    BD_GRF    DATABASE     {   CREATE DATABASE "BD_GRF" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "BD_GRF";
                postgres    false                       1255    32791    actualizar_valor_total()    FUNCTION     �   CREATE FUNCTION public.actualizar_valor_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  NEW.precio_total = NEW.precio_unitario * NEW.existencias;
  RETURN NEW;
END;$$;
 /   DROP FUNCTION public.actualizar_valor_total();
       public          postgres    false                       1255    32792    codigo_alfa()    FUNCTION     �   CREATE FUNCTION public.codigo_alfa() RETURNS trigger
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
       public          postgres    false                        1255    32793    codigo_atencion()    FUNCTION     �   CREATE FUNCTION public.codigo_atencion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_atencion = 'SGC' || NEW.id_atencion;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_atencion();
       public          postgres    false            !           1255    32794    codigo_expedientes()    FUNCTION     �   CREATE FUNCTION public.codigo_expedientes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.id_expediente = 'IPC' || new.id_exp;
	RETURN NEW;
END;
$$;
 +   DROP FUNCTION public.codigo_expedientes();
       public          postgres    false            "           1255    32795    codigo_imagenes()    FUNCTION     �   CREATE FUNCTION public.codigo_imagenes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_solicitud = 'SIMG' || NEW.id_solicitud;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_imagenes();
       public          postgres    false            &           1255    41018    codigo_informe()    FUNCTION     �   CREATE FUNCTION public.codigo_informe() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_informes_central = 'CINF' || NEW.id_informes_central;
	RETURN NEW;
END;$$;
 '   DROP FUNCTION public.codigo_informe();
       public          postgres    false            #           1255    32796    codigo_inventario()    FUNCTION     �   CREATE FUNCTION public.codigo_inventario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_producto = 'BM' || NEW.id_producto;
	RETURN NEW;
END;$$;
 *   DROP FUNCTION public.codigo_inventario();
       public          postgres    false            $           1255    32797    codigo_servicio()    FUNCTION     �   CREATE FUNCTION public.codigo_servicio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.cod_reporte_service = 'CRSV' || NEW.id_reporte_service;
	RETURN NEW;
END;$$;
 (   DROP FUNCTION public.codigo_servicio();
       public          postgres    false            %           1255    32798    insercion_clave_imagenes()    FUNCTION     �  CREATE FUNCTION public.insercion_clave_imagenes() RETURNS trigger
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
       public          postgres    false            �            1259    32799    acciones    TABLE       CREATE TABLE public.acciones (
    cod_accion integer NOT NULL,
    fecha_accion timestamp without time zone,
    desc_acciones character varying,
    id_atencion integer NOT NULL,
    estado_accion character varying,
    fecha_resolucion timestamp without time zone
);
    DROP TABLE public.acciones;
       public         heap    postgres    false            �            1259    32804    acciones_cod_accion_seq    SEQUENCE     �   CREATE SEQUENCE public.acciones_cod_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.acciones_cod_accion_seq;
       public          postgres    false    215            e           0    0    acciones_cod_accion_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.acciones_cod_accion_seq OWNED BY public.acciones.cod_accion;
          public          postgres    false    216            �            1259    32805    atencion_ciudadana    TABLE     �   CREATE TABLE public.atencion_ciudadana (
    id_atencion integer NOT NULL,
    cod_atencion character varying NOT NULL,
    id_atencion_usuario integer,
    id_atencion_sector integer,
    id_atencion_solicitud integer,
    id_atencion_proceso integer
);
 &   DROP TABLE public.atencion_ciudadana;
       public         heap    postgres    false            �            1259    32810 "   atencion_ciudadana_id_atencion_seq    SEQUENCE     �   CREATE SEQUENCE public.atencion_ciudadana_id_atencion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.atencion_ciudadana_id_atencion_seq;
       public          postgres    false    217            f           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.atencion_ciudadana_id_atencion_seq OWNED BY public.atencion_ciudadana.id_atencion;
          public          postgres    false    218            �            1259    32811    central    TABLE     �  CREATE TABLE public.central (
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
       public         heap    postgres    false            �            1259    32816    central_id_reporte_seq    SEQUENCE     �   CREATE SEQUENCE public.central_id_reporte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.central_id_reporte_seq;
       public          postgres    false    219            g           0    0    central_id_reporte_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.central_id_reporte_seq OWNED BY public.central.id_reporte;
          public          postgres    false    220            �            1259    32817    contribuyentes    TABLE     -  CREATE TABLE public.contribuyentes (
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
       public         heap    postgres    false            �            1259    32822    contribuyentes_id_contri_seq    SEQUENCE     �   CREATE SEQUENCE public.contribuyentes_id_contri_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.contribuyentes_id_contri_seq;
       public          postgres    false    221            h           0    0    contribuyentes_id_contri_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.contribuyentes_id_contri_seq OWNED BY public.contribuyentes.id_contri;
          public          postgres    false    222            �            1259    32823    danios_y_montos    TABLE     �   CREATE TABLE public.danios_y_montos (
    "id_daños" integer NOT NULL,
    "daños_vivienda" character varying,
    "daños_infra" character varying,
    "daños_personas" jsonb,
    monto_estimado integer,
    "cod_alfa_daños" character varying
);
 #   DROP TABLE public.danios_y_montos;
       public         heap    postgres    false            �            1259    32828    danios_y_montos_id_daños_seq    SEQUENCE     �   CREATE SEQUENCE public."danios_y_montos_id_daños_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."danios_y_montos_id_daños_seq";
       public          postgres    false    223            i           0    0    danios_y_montos_id_daños_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public."danios_y_montos_id_daños_seq" OWNED BY public.danios_y_montos."id_daños";
          public          postgres    false    224            �            1259    32829    datos_atencion_procesos    TABLE     R  CREATE TABLE public.datos_atencion_procesos (
    id_atencion_proceso integer NOT NULL,
    fecha_solicitud timestamp without time zone,
    estado_solicitud character varying,
    responsable_solicitud character varying,
    medio_atencion character varying,
    tipo_solicitud character varying,
    temas_atencion character varying
);
 +   DROP TABLE public.datos_atencion_procesos;
       public         heap    postgres    false            �            1259    32834 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq;
       public          postgres    false    225            j           0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_procesos_id_atencion_proceso_seq OWNED BY public.datos_atencion_procesos.id_atencion_proceso;
          public          postgres    false    226            �            1259    32835    datos_atencion_sector    TABLE        CREATE TABLE public.datos_atencion_sector (
    id_atencion_sector integer NOT NULL,
    direccion_solicitante character varying,
    sector_solicitante character varying,
    poblacion_solicitante character varying,
    junta_vecinos character varying
);
 )   DROP TABLE public.datos_atencion_sector;
       public         heap    postgres    false            �            1259    32840 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq;
       public          postgres    false    227            k           0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.datos_atencion_sector_id_atencion_sector_seq OWNED BY public.datos_atencion_sector.id_atencion_sector;
          public          postgres    false    228            �            1259    32841    datos_atencion_solicitud    TABLE       CREATE TABLE public.datos_atencion_solicitud (
    id_atencion_solicitud integer NOT NULL,
    descripcion_solicitud character varying,
    observaciones_solicitud character varying,
    medidas_seguridad character varying,
    espacios_publicos character varying
);
 ,   DROP TABLE public.datos_atencion_solicitud;
       public         heap    postgres    false            �            1259    32846 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq;
       public          postgres    false    229            l           0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_solicitud_id_atencion_solicitud_seq OWNED BY public.datos_atencion_solicitud.id_atencion_solicitud;
          public          postgres    false    230            �            1259    32847    datos_atencion_usuario    TABLE       CREATE TABLE public.datos_atencion_usuario (
    id_atencion_usuarios integer NOT NULL,
    nombre_solicitante character varying,
    telefono_solicitante character varying,
    correo_solicitante character varying,
    rut_solicitante character varying
);
 *   DROP TABLE public.datos_atencion_usuario;
       public         heap    postgres    false            �            1259    32852 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq;
       public          postgres    false    231            m           0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_atencion_usuario_id_atencion_usuarios_seq OWNED BY public.datos_atencion_usuario.id_atencion_usuarios;
          public          postgres    false    232                       1259    40983    datos_origen_informe    TABLE     N  CREATE TABLE public.datos_origen_informe (
    id_origen_informe integer NOT NULL,
    fecha_informe timestamp without time zone,
    origen_informe character varying,
    persona_informante character varying,
    captura_informe character varying,
    clasificacion_informe character varying,
    estado_informe character varying
);
 (   DROP TABLE public.datos_origen_informe;
       public         heap    postgres    false                       1259    40982 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_origen_informe_id_origen_informe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_origen_informe_id_origen_informe_seq;
       public          postgres    false    277            n           0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_origen_informe_id_origen_informe_seq OWNED BY public.datos_origen_informe.id_origen_informe;
          public          postgres    false    276            �            1259    32853    datos_solicitud_denuncia    TABLE     �   CREATE TABLE public.datos_solicitud_denuncia (
    id_denuncia integer NOT NULL,
    entidad character varying,
    num_parte character varying
);
 ,   DROP TABLE public.datos_solicitud_denuncia;
       public         heap    postgres    false            �            1259    32858 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq;
       public          postgres    false    233            o           0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_solicitud_denuncia_id_denuncia_seq OWNED BY public.datos_solicitud_denuncia.id_denuncia;
          public          postgres    false    234            �            1259    32859    datos_solicitud_grabacion    TABLE     M  CREATE TABLE public.datos_solicitud_grabacion (
    id_grabacion integer NOT NULL,
    descripcion_solicitud character varying,
    fecha_siniestro timestamp without time zone,
    direccion_solicitud character varying,
    sector_solicitud character varying,
    camaras character varying,
    estado_solicitud character varying
);
 -   DROP TABLE public.datos_solicitud_grabacion;
       public         heap    postgres    false            �            1259    32864 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq;
       public          postgres    false    235            p           0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_grabacion_id_grabacion_seq OWNED BY public.datos_solicitud_grabacion.id_grabacion;
          public          postgres    false    236            �            1259    32865    datos_solicitud_responsable    TABLE     �   CREATE TABLE public.datos_solicitud_responsable (
    id_responsable integer NOT NULL,
    nombre_responsable character varying,
    institucion character varying,
    rut_responsable character varying
);
 /   DROP TABLE public.datos_solicitud_responsable;
       public         heap    postgres    false            �            1259    32870 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_responsable_id_responsable_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 E   DROP SEQUENCE public.datos_solicitud_responsable_id_responsable_seq;
       public          postgres    false    237            q           0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.datos_solicitud_responsable_id_responsable_seq OWNED BY public.datos_solicitud_responsable.id_responsable;
          public          postgres    false    238            �            1259    32871    datos_solicitud_usuarios    TABLE     /  CREATE TABLE public.datos_solicitud_usuarios (
    id_usuarios_img integer NOT NULL,
    fecha_solicitud timestamp without time zone,
    rut_solicitante character varying,
    nombre_solicitante character varying,
    telefono_solicitante character varying,
    e_mail_solicitante character varying
);
 ,   DROP TABLE public.datos_solicitud_usuarios;
       public         heap    postgres    false            �            1259    32876 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq;
       public          postgres    false    239            r           0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_solicitud_usuarios_id_usuarios_seq OWNED BY public.datos_solicitud_usuarios.id_usuarios_img;
          public          postgres    false    240                       1259    40992    datos_tipos_informes    TABLE     �   CREATE TABLE public.datos_tipos_informes (
    id_tipos_informes integer NOT NULL,
    tipo_informe character varying,
    otro_tipo character varying,
    descripcion_informe character varying,
    recursos_informe character varying[]
);
 (   DROP TABLE public.datos_tipos_informes;
       public         heap    postgres    false                       1259    40991 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq;
       public          postgres    false    279            s           0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.datos_tipos_informes_id_tipos_informes_seq OWNED BY public.datos_tipos_informes.id_tipos_informes;
          public          postgres    false    278                       1259    41010    datos_ubicacion_informe    TABLE     �   CREATE TABLE public.datos_ubicacion_informe (
    id_ubicacion integer NOT NULL,
    sector_informe character varying,
    direccion_informe character varying
);
 +   DROP TABLE public.datos_ubicacion_informe;
       public         heap    postgres    false                       1259    41009 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq;
       public          postgres    false    283            t           0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_ubicacion_informe_id_ubicacion_seq OWNED BY public.datos_ubicacion_informe.id_ubicacion;
          public          postgres    false    282            �            1259    32877    datos_vehiculos    TABLE     �   CREATE TABLE public.datos_vehiculos (
    id_veh integer NOT NULL,
    tipo character varying,
    marca character varying,
    modelo character varying,
    color character varying
);
 #   DROP TABLE public.datos_vehiculos;
       public         heap    postgres    false            �            1259    32882    datos_vehiculos_id_veh_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_vehiculos_id_veh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.datos_vehiculos_id_veh_seq;
       public          postgres    false    241            u           0    0    datos_vehiculos_id_veh_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.datos_vehiculos_id_veh_seq OWNED BY public.datos_vehiculos.id_veh;
          public          postgres    false    242                       1259    41001    datos_vehiculos_informe    TABLE     �   CREATE TABLE public.datos_vehiculos_informe (
    id_vehiculos integer NOT NULL,
    vehiculos_informe character varying,
    tripulantes_informe character varying
);
 +   DROP TABLE public.datos_vehiculos_informe;
       public         heap    postgres    false                       1259    41000 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE     �   CREATE SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq;
       public          postgres    false    281            v           0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.datos_vehiculos_informe_id_vehiculos_seq OWNED BY public.datos_vehiculos_informe.id_vehiculos;
          public          postgres    false    280            �            1259    32883    doc_adjuntos    TABLE     �   CREATE TABLE public.doc_adjuntos (
    id_adjunto integer NOT NULL,
    path_document character varying,
    id_reporte integer,
    id_expediente character varying,
    id_atencion character varying
);
     DROP TABLE public.doc_adjuntos;
       public         heap    postgres    false            �            1259    32888    doc_adjuntos_id_adjunto_seq    SEQUENCE     �   CREATE SEQUENCE public.doc_adjuntos_id_adjunto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.doc_adjuntos_id_adjunto_seq;
       public          postgres    false    243            w           0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.doc_adjuntos_id_adjunto_seq OWNED BY public.doc_adjuntos.id_adjunto;
          public          postgres    false    244            �            1259    32889    expedientes    TABLE     �  CREATE TABLE public.expedientes (
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
       public         heap    postgres    false            �            1259    32894    expedientes_id_exp_seq    SEQUENCE     �   CREATE SEQUENCE public.expedientes_id_exp_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.expedientes_id_exp_seq;
       public          postgres    false    245            x           0    0    expedientes_id_exp_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.expedientes_id_exp_seq OWNED BY public.expedientes.id_exp;
          public          postgres    false    246            �            1259    32895    funcionarios    TABLE     �   CREATE TABLE public.funcionarios (
    id_funcionario character varying(20) NOT NULL,
    funcionario character varying,
    chofer boolean,
    id_vehiculo character varying(5),
    rol_func character varying
);
     DROP TABLE public.funcionarios;
       public         heap    postgres    false            �            1259    32900 
   glosas_ley    TABLE     c   CREATE TABLE public.glosas_ley (
    id_glosa integer NOT NULL,
    glosa_ley character varying
);
    DROP TABLE public.glosas_ley;
       public         heap    postgres    false            �            1259    32905    glosas_ley_id_glosa_seq    SEQUENCE     �   CREATE SEQUENCE public.glosas_ley_id_glosa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.glosas_ley_id_glosa_seq;
       public          postgres    false    248            y           0    0    glosas_ley_id_glosa_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.glosas_ley_id_glosa_seq OWNED BY public.glosas_ley.id_glosa;
          public          postgres    false    249            �            1259    32906    informantes    TABLE     �   CREATE TABLE public.informantes (
    id_informante character varying(20) NOT NULL,
    informante character varying(50),
    telefono character varying(15)
);
    DROP TABLE public.informantes;
       public         heap    postgres    false            �            1259    32909    informes_alfa    TABLE     �  CREATE TABLE public.informes_alfa (
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
       public         heap    postgres    false            �            1259    32914    informes_alfa_id_alfa_seq    SEQUENCE     �   CREATE SEQUENCE public.informes_alfa_id_alfa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.informes_alfa_id_alfa_seq;
       public          postgres    false    251            z           0    0    informes_alfa_id_alfa_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.informes_alfa_id_alfa_seq OWNED BY public.informes_alfa.id_alfa;
          public          postgres    false    252                       1259    41019    informes_central    TABLE       CREATE TABLE public.informes_central (
    id_informes_central integer NOT NULL,
    cod_informes_central character varying NOT NULL,
    id_origen_informe integer,
    id_tipos_informe integer,
    id_ubicacion_informe integer,
    id_vehiculo_informe integer
);
 $   DROP TABLE public.informes_central;
       public         heap    postgres    false                       1259    41024 (   informes_central_id_informes_central_seq    SEQUENCE     �   CREATE SEQUENCE public.informes_central_id_informes_central_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.informes_central_id_informes_central_seq;
       public          postgres    false    284            {           0    0 (   informes_central_id_informes_central_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.informes_central_id_informes_central_seq OWNED BY public.informes_central.id_informes_central;
          public          postgres    false    285            �            1259    32915    infracciones    TABLE     _  CREATE TABLE public.infracciones (
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
       public         heap    postgres    false            �            1259    32920    infracciones_id_infraccion_seq    SEQUENCE     �   CREATE SEQUENCE public.infracciones_id_infraccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.infracciones_id_infraccion_seq;
       public          postgres    false    253            |           0    0    infracciones_id_infraccion_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.infracciones_id_infraccion_seq OWNED BY public.infracciones.id_infraccion;
          public          postgres    false    254            �            1259    32921    inventario_grd    TABLE     w  CREATE TABLE public.inventario_grd (
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
       public         heap    postgres    false                        1259    32926    inventario_grd_id_producto_seq    SEQUENCE     �   CREATE SEQUENCE public.inventario_grd_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.inventario_grd_id_producto_seq;
       public          postgres    false    255            }           0    0    inventario_grd_id_producto_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.inventario_grd_id_producto_seq OWNED BY public.inventario_grd.id_producto;
          public          postgres    false    256                       1259    32927    leyes    TABLE     V   CREATE TABLE public.leyes (
    id_ley integer NOT NULL,
    ley character varying
);
    DROP TABLE public.leyes;
       public         heap    postgres    false                       1259    32932    leyes_id_ley_seq    SEQUENCE     �   CREATE SEQUENCE public.leyes_id_ley_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.leyes_id_ley_seq;
       public          postgres    false    257            ~           0    0    leyes_id_ley_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.leyes_id_ley_seq OWNED BY public.leyes.id_ley;
          public          postgres    false    258                       1259    32933    origenes    TABLE     c   CREATE TABLE public.origenes (
    id_origen integer NOT NULL,
    origen character varying(50)
);
    DROP TABLE public.origenes;
       public         heap    postgres    false                       1259    32936    origenes_id_origen_seq    SEQUENCE     �   CREATE SEQUENCE public.origenes_id_origen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.origenes_id_origen_seq;
       public          postgres    false    259                       0    0    origenes_id_origen_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.origenes_id_origen_seq OWNED BY public.origenes.id_origen;
          public          postgres    false    260                       1259    32937    productos_grd    TABLE     d  CREATE TABLE public.productos_grd (
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
       public         heap    postgres    false                       1259    32942    productos_grd_id_productos_seq    SEQUENCE     �   CREATE SEQUENCE public.productos_grd_id_productos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.productos_grd_id_productos_seq;
       public          postgres    false    261            �           0    0    productos_grd_id_productos_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.productos_grd_id_productos_seq OWNED BY public.productos_grd.id_productos_grd;
          public          postgres    false    262                       1259    32943    reportes_servicios_central    TABLE     V  CREATE TABLE public.reportes_servicios_central (
    id_reporte_service integer NOT NULL,
    cod_reporte_service character varying NOT NULL,
    fecha_reporte timestamp without time zone,
    usuario_reporte character varying,
    vehiculo_reporte character varying,
    tipo_reporte character varying,
    usuario_crea character varying
);
 .   DROP TABLE public.reportes_servicios_central;
       public         heap    postgres    false                       1259    32948 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE     �   CREATE SEQUENCE public.reportes_servicios_central_id_reporte_service_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 H   DROP SEQUENCE public.reportes_servicios_central_id_reporte_service_seq;
       public          postgres    false    263            �           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.reportes_servicios_central_id_reporte_service_seq OWNED BY public.reportes_servicios_central.id_reporte_service;
          public          postgres    false    264            	           1259    32949    sectores    TABLE     �   CREATE TABLE public.sectores (
    id_sector character varying(20) NOT NULL,
    sector character varying(30),
    coordenada character varying,
    tipo_ubicacion character varying(7)
);
    DROP TABLE public.sectores;
       public         heap    postgres    false            
           1259    32954    sectores_alfa    TABLE       CREATE TABLE public.sectores_alfa (
    id_sectores_alfa integer NOT NULL,
    region character varying,
    provincia character varying,
    comuna character varying,
    direccion character varying,
    tipo_ubicacion character varying,
    cod_alfa_sector character varying
);
 !   DROP TABLE public.sectores_alfa;
       public         heap    postgres    false                       1259    32959 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE     �   CREATE SEQUENCE public.sectores_alfa_id_sectores_alfa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.sectores_alfa_id_sectores_alfa_seq;
       public          postgres    false    266            �           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.sectores_alfa_id_sectores_alfa_seq OWNED BY public.sectores_alfa.id_sectores_alfa;
          public          postgres    false    267                       1259    32960    solicitudes_imagenes    TABLE     �   CREATE TABLE public.solicitudes_imagenes (
    id_solicitud integer NOT NULL,
    cod_solicitud character varying NOT NULL,
    id_usuarios_img integer,
    id_responsable integer,
    id_grabacion integer,
    id_denuncia integer
);
 (   DROP TABLE public.solicitudes_imagenes;
       public         heap    postgres    false                       1259    32965 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE     �   CREATE SEQUENCE public.solicitudes_imagenes_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.solicitudes_imagenes_id_solicitud_seq;
       public          postgres    false    268            �           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.solicitudes_imagenes_id_solicitud_seq OWNED BY public.solicitudes_imagenes.id_solicitud;
          public          postgres    false    269                       1259    32966    tipo_reportes    TABLE     �   CREATE TABLE public.tipo_reportes (
    id_tipo integer NOT NULL,
    descripcion character varying(60),
    grupo_reporte character varying(25)
);
 !   DROP TABLE public.tipo_reportes;
       public         heap    postgres    false                       1259    32969    tipo_reportes_id_tipo_seq    SEQUENCE     �   CREATE SEQUENCE public.tipo_reportes_id_tipo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.tipo_reportes_id_tipo_seq;
       public          postgres    false    270            �           0    0    tipo_reportes_id_tipo_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.tipo_reportes_id_tipo_seq OWNED BY public.tipo_reportes.id_tipo;
          public          postgres    false    271                       1259    32970    usuarios_sistema    TABLE     �   CREATE TABLE public.usuarios_sistema (
    id_usuario character varying(5) NOT NULL,
    nombre_usuario character varying(50),
    password character varying(8)
);
 $   DROP TABLE public.usuarios_sistema;
       public         heap    postgres    false                       1259    32973 	   vehiculos    TABLE     �   CREATE TABLE public.vehiculos (
    id_vehiculo character varying(5) NOT NULL,
    vehiculo character varying,
    tipo character varying
);
    DROP TABLE public.vehiculos;
       public         heap    postgres    false                       1259    32978    vehiculos_contri    TABLE       CREATE TABLE public.vehiculos_contri (
    tipo_vehi character varying,
    marca_vehi character varying,
    ppu character varying,
    color_vehi character varying,
    id_vehiculos integer NOT NULL,
    id_contri integer,
    id_expediente character varying
);
 $   DROP TABLE public.vehiculos_contri;
       public         heap    postgres    false                       1259    32983    vehiculos_contri_id_v_seq    SEQUENCE     �   CREATE SEQUENCE public.vehiculos_contri_id_v_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.vehiculos_contri_id_v_seq;
       public          postgres    false    274            �           0    0    vehiculos_contri_id_v_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.vehiculos_contri_id_v_seq OWNED BY public.vehiculos_contri.id_vehiculos;
          public          postgres    false    275            �           2604    41025    acciones cod_accion    DEFAULT     z   ALTER TABLE ONLY public.acciones ALTER COLUMN cod_accion SET DEFAULT nextval('public.acciones_cod_accion_seq'::regclass);
 B   ALTER TABLE public.acciones ALTER COLUMN cod_accion DROP DEFAULT;
       public          postgres    false    216    215            �           2604    41026    atencion_ciudadana id_atencion    DEFAULT     �   ALTER TABLE ONLY public.atencion_ciudadana ALTER COLUMN id_atencion SET DEFAULT nextval('public.atencion_ciudadana_id_atencion_seq'::regclass);
 M   ALTER TABLE public.atencion_ciudadana ALTER COLUMN id_atencion DROP DEFAULT;
       public          postgres    false    218    217            �           2604    41027    central id_reporte    DEFAULT     x   ALTER TABLE ONLY public.central ALTER COLUMN id_reporte SET DEFAULT nextval('public.central_id_reporte_seq'::regclass);
 A   ALTER TABLE public.central ALTER COLUMN id_reporte DROP DEFAULT;
       public          postgres    false    220    219            �           2604    41028    contribuyentes id_contri    DEFAULT     �   ALTER TABLE ONLY public.contribuyentes ALTER COLUMN id_contri SET DEFAULT nextval('public.contribuyentes_id_contri_seq'::regclass);
 G   ALTER TABLE public.contribuyentes ALTER COLUMN id_contri DROP DEFAULT;
       public          postgres    false    222    221            �           2604    41029    danios_y_montos id_daños    DEFAULT     �   ALTER TABLE ONLY public.danios_y_montos ALTER COLUMN "id_daños" SET DEFAULT nextval('public."danios_y_montos_id_daños_seq"'::regclass);
 J   ALTER TABLE public.danios_y_montos ALTER COLUMN "id_daños" DROP DEFAULT;
       public          postgres    false    224    223            �           2604    41030 +   datos_atencion_procesos id_atencion_proceso    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso SET DEFAULT nextval('public.datos_atencion_procesos_id_atencion_proceso_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_procesos ALTER COLUMN id_atencion_proceso DROP DEFAULT;
       public          postgres    false    226    225            �           2604    41031 (   datos_atencion_sector id_atencion_sector    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_sector ALTER COLUMN id_atencion_sector SET DEFAULT nextval('public.datos_atencion_sector_id_atencion_sector_seq'::regclass);
 W   ALTER TABLE public.datos_atencion_sector ALTER COLUMN id_atencion_sector DROP DEFAULT;
       public          postgres    false    228    227            �           2604    41032 .   datos_atencion_solicitud id_atencion_solicitud    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud SET DEFAULT nextval('public.datos_atencion_solicitud_id_atencion_solicitud_seq'::regclass);
 ]   ALTER TABLE public.datos_atencion_solicitud ALTER COLUMN id_atencion_solicitud DROP DEFAULT;
       public          postgres    false    230    229            �           2604    41033 +   datos_atencion_usuario id_atencion_usuarios    DEFAULT     �   ALTER TABLE ONLY public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios SET DEFAULT nextval('public.datos_atencion_usuario_id_atencion_usuarios_seq'::regclass);
 Z   ALTER TABLE public.datos_atencion_usuario ALTER COLUMN id_atencion_usuarios DROP DEFAULT;
       public          postgres    false    232    231            �           2604    41034 &   datos_origen_informe id_origen_informe    DEFAULT     �   ALTER TABLE ONLY public.datos_origen_informe ALTER COLUMN id_origen_informe SET DEFAULT nextval('public.datos_origen_informe_id_origen_informe_seq'::regclass);
 U   ALTER TABLE public.datos_origen_informe ALTER COLUMN id_origen_informe DROP DEFAULT;
       public          postgres    false    277    276    277            �           2604    41035 $   datos_solicitud_denuncia id_denuncia    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_denuncia ALTER COLUMN id_denuncia SET DEFAULT nextval('public.datos_solicitud_denuncia_id_denuncia_seq'::regclass);
 S   ALTER TABLE public.datos_solicitud_denuncia ALTER COLUMN id_denuncia DROP DEFAULT;
       public          postgres    false    234    233            �           2604    41036 &   datos_solicitud_grabacion id_grabacion    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion ALTER COLUMN id_grabacion SET DEFAULT nextval('public.datos_solicitud_grabacion_id_grabacion_seq'::regclass);
 U   ALTER TABLE public.datos_solicitud_grabacion ALTER COLUMN id_grabacion DROP DEFAULT;
       public          postgres    false    236    235            �           2604    41037 *   datos_solicitud_responsable id_responsable    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_responsable ALTER COLUMN id_responsable SET DEFAULT nextval('public.datos_solicitud_responsable_id_responsable_seq'::regclass);
 Y   ALTER TABLE public.datos_solicitud_responsable ALTER COLUMN id_responsable DROP DEFAULT;
       public          postgres    false    238    237            �           2604    41038 (   datos_solicitud_usuarios id_usuarios_img    DEFAULT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img SET DEFAULT nextval('public.datos_solicitud_usuarios_id_usuarios_seq'::regclass);
 W   ALTER TABLE public.datos_solicitud_usuarios ALTER COLUMN id_usuarios_img DROP DEFAULT;
       public          postgres    false    240    239            �           2604    41039 &   datos_tipos_informes id_tipos_informes    DEFAULT     �   ALTER TABLE ONLY public.datos_tipos_informes ALTER COLUMN id_tipos_informes SET DEFAULT nextval('public.datos_tipos_informes_id_tipos_informes_seq'::regclass);
 U   ALTER TABLE public.datos_tipos_informes ALTER COLUMN id_tipos_informes DROP DEFAULT;
       public          postgres    false    279    278    279            �           2604    41040 $   datos_ubicacion_informe id_ubicacion    DEFAULT     �   ALTER TABLE ONLY public.datos_ubicacion_informe ALTER COLUMN id_ubicacion SET DEFAULT nextval('public.datos_ubicacion_informe_id_ubicacion_seq'::regclass);
 S   ALTER TABLE public.datos_ubicacion_informe ALTER COLUMN id_ubicacion DROP DEFAULT;
       public          postgres    false    283    282    283            �           2604    41041    datos_vehiculos id_veh    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos ALTER COLUMN id_veh SET DEFAULT nextval('public.datos_vehiculos_id_veh_seq'::regclass);
 E   ALTER TABLE public.datos_vehiculos ALTER COLUMN id_veh DROP DEFAULT;
       public          postgres    false    242    241            �           2604    41042 $   datos_vehiculos_informe id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.datos_vehiculos_informe ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.datos_vehiculos_informe_id_vehiculos_seq'::regclass);
 S   ALTER TABLE public.datos_vehiculos_informe ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    281    280    281            �           2604    41043    doc_adjuntos id_adjunto    DEFAULT     �   ALTER TABLE ONLY public.doc_adjuntos ALTER COLUMN id_adjunto SET DEFAULT nextval('public.doc_adjuntos_id_adjunto_seq'::regclass);
 F   ALTER TABLE public.doc_adjuntos ALTER COLUMN id_adjunto DROP DEFAULT;
       public          postgres    false    244    243            �           2604    41044    expedientes id_exp    DEFAULT     x   ALTER TABLE ONLY public.expedientes ALTER COLUMN id_exp SET DEFAULT nextval('public.expedientes_id_exp_seq'::regclass);
 A   ALTER TABLE public.expedientes ALTER COLUMN id_exp DROP DEFAULT;
       public          postgres    false    246    245            �           2604    41045    glosas_ley id_glosa    DEFAULT     z   ALTER TABLE ONLY public.glosas_ley ALTER COLUMN id_glosa SET DEFAULT nextval('public.glosas_ley_id_glosa_seq'::regclass);
 B   ALTER TABLE public.glosas_ley ALTER COLUMN id_glosa DROP DEFAULT;
       public          postgres    false    249    248            �           2604    41046    informes_alfa id_alfa    DEFAULT     ~   ALTER TABLE ONLY public.informes_alfa ALTER COLUMN id_alfa SET DEFAULT nextval('public.informes_alfa_id_alfa_seq'::regclass);
 D   ALTER TABLE public.informes_alfa ALTER COLUMN id_alfa DROP DEFAULT;
       public          postgres    false    252    251            �           2604    41047 $   informes_central id_informes_central    DEFAULT     �   ALTER TABLE ONLY public.informes_central ALTER COLUMN id_informes_central SET DEFAULT nextval('public.informes_central_id_informes_central_seq'::regclass);
 S   ALTER TABLE public.informes_central ALTER COLUMN id_informes_central DROP DEFAULT;
       public          postgres    false    285    284            �           2604    41048    infracciones id_infraccion    DEFAULT     �   ALTER TABLE ONLY public.infracciones ALTER COLUMN id_infraccion SET DEFAULT nextval('public.infracciones_id_infraccion_seq'::regclass);
 I   ALTER TABLE public.infracciones ALTER COLUMN id_infraccion DROP DEFAULT;
       public          postgres    false    254    253            �           2604    41049    inventario_grd id_producto    DEFAULT     �   ALTER TABLE ONLY public.inventario_grd ALTER COLUMN id_producto SET DEFAULT nextval('public.inventario_grd_id_producto_seq'::regclass);
 I   ALTER TABLE public.inventario_grd ALTER COLUMN id_producto DROP DEFAULT;
       public          postgres    false    256    255            �           2604    41050    leyes id_ley    DEFAULT     l   ALTER TABLE ONLY public.leyes ALTER COLUMN id_ley SET DEFAULT nextval('public.leyes_id_ley_seq'::regclass);
 ;   ALTER TABLE public.leyes ALTER COLUMN id_ley DROP DEFAULT;
       public          postgres    false    258    257            �           2604    41051    origenes id_origen    DEFAULT     x   ALTER TABLE ONLY public.origenes ALTER COLUMN id_origen SET DEFAULT nextval('public.origenes_id_origen_seq'::regclass);
 A   ALTER TABLE public.origenes ALTER COLUMN id_origen DROP DEFAULT;
       public          postgres    false    260    259            �           2604    41052    productos_grd id_productos_grd    DEFAULT     �   ALTER TABLE ONLY public.productos_grd ALTER COLUMN id_productos_grd SET DEFAULT nextval('public.productos_grd_id_productos_seq'::regclass);
 M   ALTER TABLE public.productos_grd ALTER COLUMN id_productos_grd DROP DEFAULT;
       public          postgres    false    262    261            �           2604    41053 -   reportes_servicios_central id_reporte_service    DEFAULT     �   ALTER TABLE ONLY public.reportes_servicios_central ALTER COLUMN id_reporte_service SET DEFAULT nextval('public.reportes_servicios_central_id_reporte_service_seq'::regclass);
 \   ALTER TABLE public.reportes_servicios_central ALTER COLUMN id_reporte_service DROP DEFAULT;
       public          postgres    false    264    263            �           2604    41054    sectores_alfa id_sectores_alfa    DEFAULT     �   ALTER TABLE ONLY public.sectores_alfa ALTER COLUMN id_sectores_alfa SET DEFAULT nextval('public.sectores_alfa_id_sectores_alfa_seq'::regclass);
 M   ALTER TABLE public.sectores_alfa ALTER COLUMN id_sectores_alfa DROP DEFAULT;
       public          postgres    false    267    266            �           2604    41055 !   solicitudes_imagenes id_solicitud    DEFAULT     �   ALTER TABLE ONLY public.solicitudes_imagenes ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitudes_imagenes_id_solicitud_seq'::regclass);
 P   ALTER TABLE public.solicitudes_imagenes ALTER COLUMN id_solicitud DROP DEFAULT;
       public          postgres    false    269    268            �           2604    41056    tipo_reportes id_tipo    DEFAULT     ~   ALTER TABLE ONLY public.tipo_reportes ALTER COLUMN id_tipo SET DEFAULT nextval('public.tipo_reportes_id_tipo_seq'::regclass);
 D   ALTER TABLE public.tipo_reportes ALTER COLUMN id_tipo DROP DEFAULT;
       public          postgres    false    271    270            �           2604    41057    vehiculos_contri id_vehiculos    DEFAULT     �   ALTER TABLE ONLY public.vehiculos_contri ALTER COLUMN id_vehiculos SET DEFAULT nextval('public.vehiculos_contri_id_v_seq'::regclass);
 L   ALTER TABLE public.vehiculos_contri ALTER COLUMN id_vehiculos DROP DEFAULT;
       public          postgres    false    275    274                      0    32799    acciones 
   TABLE DATA           y   COPY public.acciones (cod_accion, fecha_accion, desc_acciones, id_atencion, estado_accion, fecha_resolucion) FROM stdin;
    public          postgres    false    215   �                0    32805    atencion_ciudadana 
   TABLE DATA           �   COPY public.atencion_ciudadana (id_atencion, cod_atencion, id_atencion_usuario, id_atencion_sector, id_atencion_solicitud, id_atencion_proceso) FROM stdin;
    public          postgres    false    217   ��                0    32811    central 
   TABLE DATA           0  COPY public.central (id_reporte, fecha_ocurrencia, estado, fuente_captura, origen_captura, clasificacion, desc_reporte, fecha_cierre, otro_recurso, id_informante, id_sector, id_funcionario, direccion, coordenadas, id_tipo_reporte, id_user_central, id_origen, recursos, vehiculo, acompanante) FROM stdin;
    public          postgres    false    219   �                0    32817    contribuyentes 
   TABLE DATA           �   COPY public.contribuyentes (id_contri, rut_contri, nombre, direccion, rol_contri, giro_contri, id_infraccion, id_expediente) FROM stdin;
    public          postgres    false    221   �                 0    32823    danios_y_montos 
   TABLE DATA           �   COPY public.danios_y_montos ("id_daños", "daños_vivienda", "daños_infra", "daños_personas", monto_estimado, "cod_alfa_daños") FROM stdin;
    public          postgres    false    223   E�      "          0    32829    datos_atencion_procesos 
   TABLE DATA           �   COPY public.datos_atencion_procesos (id_atencion_proceso, fecha_solicitud, estado_solicitud, responsable_solicitud, medio_atencion, tipo_solicitud, temas_atencion) FROM stdin;
    public          postgres    false    225   ��      $          0    32835    datos_atencion_sector 
   TABLE DATA           �   COPY public.datos_atencion_sector (id_atencion_sector, direccion_solicitante, sector_solicitante, poblacion_solicitante, junta_vecinos) FROM stdin;
    public          postgres    false    227   ��      &          0    32841    datos_atencion_solicitud 
   TABLE DATA           �   COPY public.datos_atencion_solicitud (id_atencion_solicitud, descripcion_solicitud, observaciones_solicitud, medidas_seguridad, espacios_publicos) FROM stdin;
    public          postgres    false    229   ��      (          0    32847    datos_atencion_usuario 
   TABLE DATA           �   COPY public.datos_atencion_usuario (id_atencion_usuarios, nombre_solicitante, telefono_solicitante, correo_solicitante, rut_solicitante) FROM stdin;
    public          postgres    false    231   ��      V          0    40983    datos_origen_informe 
   TABLE DATA           �   COPY public.datos_origen_informe (id_origen_informe, fecha_informe, origen_informe, persona_informante, captura_informe, clasificacion_informe, estado_informe) FROM stdin;
    public          postgres    false    277   {�      *          0    32853    datos_solicitud_denuncia 
   TABLE DATA           S   COPY public.datos_solicitud_denuncia (id_denuncia, entidad, num_parte) FROM stdin;
    public          postgres    false    233   =�      ,          0    32859    datos_solicitud_grabacion 
   TABLE DATA           �   COPY public.datos_solicitud_grabacion (id_grabacion, descripcion_solicitud, fecha_siniestro, direccion_solicitud, sector_solicitud, camaras, estado_solicitud) FROM stdin;
    public          postgres    false    235   f�      .          0    32865    datos_solicitud_responsable 
   TABLE DATA           w   COPY public.datos_solicitud_responsable (id_responsable, nombre_responsable, institucion, rut_responsable) FROM stdin;
    public          postgres    false    237   ��      0          0    32871    datos_solicitud_usuarios 
   TABLE DATA           �   COPY public.datos_solicitud_usuarios (id_usuarios_img, fecha_solicitud, rut_solicitante, nombre_solicitante, telefono_solicitante, e_mail_solicitante) FROM stdin;
    public          postgres    false    239   ��      X          0    40992    datos_tipos_informes 
   TABLE DATA           �   COPY public.datos_tipos_informes (id_tipos_informes, tipo_informe, otro_tipo, descripcion_informe, recursos_informe) FROM stdin;
    public          postgres    false    279   ��      \          0    41010    datos_ubicacion_informe 
   TABLE DATA           b   COPY public.datos_ubicacion_informe (id_ubicacion, sector_informe, direccion_informe) FROM stdin;
    public          postgres    false    283   ��      2          0    32877    datos_vehiculos 
   TABLE DATA           M   COPY public.datos_vehiculos (id_veh, tipo, marca, modelo, color) FROM stdin;
    public          postgres    false    241   ,�      Z          0    41001    datos_vehiculos_informe 
   TABLE DATA           g   COPY public.datos_vehiculos_informe (id_vehiculos, vehiculos_informe, tripulantes_informe) FROM stdin;
    public          postgres    false    281   ��      4          0    32883    doc_adjuntos 
   TABLE DATA           i   COPY public.doc_adjuntos (id_adjunto, path_document, id_reporte, id_expediente, id_atencion) FROM stdin;
    public          postgres    false    243   ��      6          0    32889    expedientes 
   TABLE DATA           �   COPY public.expedientes (id_exp, id_expediente, fecha_resolucion, user_creador, tipo_procedimiento, empadronado, inspector, testigo, patr_mixto, patrullero, id_inspector, id_patrullero, id_leyes, id_glosas) FROM stdin;
    public          postgres    false    245   ��      8          0    32895    funcionarios 
   TABLE DATA           b   COPY public.funcionarios (id_funcionario, funcionario, chofer, id_vehiculo, rol_func) FROM stdin;
    public          postgres    false    247   Q�      9          0    32900 
   glosas_ley 
   TABLE DATA           9   COPY public.glosas_ley (id_glosa, glosa_ley) FROM stdin;
    public          postgres    false    248   ��      ;          0    32906    informantes 
   TABLE DATA           J   COPY public.informantes (id_informante, informante, telefono) FROM stdin;
    public          postgres    false    250   �      <          0    32909    informes_alfa 
   TABLE DATA           #  COPY public.informes_alfa (id_alfa, cod_alfa, fuente, fono, sismo_escala, tipo_evento, otro_evento, descripcion, ocurrencia, acciones, oportunidad_tpo, recursos_involucrados, evaluacion_necesidades, capacidad_respuesta, observaciones, usuario_grd, fecha_hora, otras_necesidades) FROM stdin;
    public          postgres    false    251   g�      ]          0    41019    informes_central 
   TABLE DATA           �   COPY public.informes_central (id_informes_central, cod_informes_central, id_origen_informe, id_tipos_informe, id_ubicacion_informe, id_vehiculo_informe) FROM stdin;
    public          postgres    false    284   ��      >          0    32915    infracciones 
   TABLE DATA           �   COPY public.infracciones (id_infraccion, sector_infraccion, direccion_infraccion, fecha_citacion, juzgado, observaciones, fecha_infraccion, id_expediente) FROM stdin;
    public          postgres    false    253   4�      @          0    32921    inventario_grd 
   TABLE DATA           �   COPY public.inventario_grd (id_producto, cod_producto, ubicacion, observaciones, id_productos_grd, usuario_creador, fecha_creado, prestamo, usuario_prestamo) FROM stdin;
    public          postgres    false    255   ��      B          0    32927    leyes 
   TABLE DATA           ,   COPY public.leyes (id_ley, ley) FROM stdin;
    public          postgres    false    257   ��      D          0    32933    origenes 
   TABLE DATA           5   COPY public.origenes (id_origen, origen) FROM stdin;
    public          postgres    false    259   �      F          0    32937    productos_grd 
   TABLE DATA           �   COPY public.productos_grd (id_productos_grd, marca, modelo, serial, desc_producto, unidad_medida, existencias, cod_producto, precio_unitario, precio_total) FROM stdin;
    public          postgres    false    261   '�      H          0    32943    reportes_servicios_central 
   TABLE DATA           �   COPY public.reportes_servicios_central (id_reporte_service, cod_reporte_service, fecha_reporte, usuario_reporte, vehiculo_reporte, tipo_reporte, usuario_crea) FROM stdin;
    public          postgres    false    263   m�      J          0    32949    sectores 
   TABLE DATA           Q   COPY public.sectores (id_sector, sector, coordenada, tipo_ubicacion) FROM stdin;
    public          postgres    false    265   ��      K          0    32954    sectores_alfa 
   TABLE DATA           �   COPY public.sectores_alfa (id_sectores_alfa, region, provincia, comuna, direccion, tipo_ubicacion, cod_alfa_sector) FROM stdin;
    public          postgres    false    266   5�      M          0    32960    solicitudes_imagenes 
   TABLE DATA           �   COPY public.solicitudes_imagenes (id_solicitud, cod_solicitud, id_usuarios_img, id_responsable, id_grabacion, id_denuncia) FROM stdin;
    public          postgres    false    268   ��      O          0    32966    tipo_reportes 
   TABLE DATA           L   COPY public.tipo_reportes (id_tipo, descripcion, grupo_reporte) FROM stdin;
    public          postgres    false    270   "�      Q          0    32970    usuarios_sistema 
   TABLE DATA           P   COPY public.usuarios_sistema (id_usuario, nombre_usuario, password) FROM stdin;
    public          postgres    false    272   ��      R          0    32973 	   vehiculos 
   TABLE DATA           @   COPY public.vehiculos (id_vehiculo, vehiculo, tipo) FROM stdin;
    public          postgres    false    273   ��      S          0    32978    vehiculos_contri 
   TABLE DATA           z   COPY public.vehiculos_contri (tipo_vehi, marca_vehi, ppu, color_vehi, id_vehiculos, id_contri, id_expediente) FROM stdin;
    public          postgres    false    274   D�      �           0    0    acciones_cod_accion_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.acciones_cod_accion_seq', 55, true);
          public          postgres    false    216            �           0    0 "   atencion_ciudadana_id_atencion_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.atencion_ciudadana_id_atencion_seq', 17, true);
          public          postgres    false    218            �           0    0    central_id_reporte_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.central_id_reporte_seq', 277, true);
          public          postgres    false    220            �           0    0    contribuyentes_id_contri_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.contribuyentes_id_contri_seq', 52, true);
          public          postgres    false    222            �           0    0    danios_y_montos_id_daños_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."danios_y_montos_id_daños_seq"', 30, true);
          public          postgres    false    224            �           0    0 /   datos_atencion_procesos_id_atencion_proceso_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_procesos_id_atencion_proceso_seq', 19, true);
          public          postgres    false    226            �           0    0 ,   datos_atencion_sector_id_atencion_sector_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.datos_atencion_sector_id_atencion_sector_seq', 20, true);
          public          postgres    false    228            �           0    0 2   datos_atencion_solicitud_id_atencion_solicitud_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.datos_atencion_solicitud_id_atencion_solicitud_seq', 19, true);
          public          postgres    false    230            �           0    0 /   datos_atencion_usuario_id_atencion_usuarios_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.datos_atencion_usuario_id_atencion_usuarios_seq', 22, true);
          public          postgres    false    232            �           0    0 *   datos_origen_informe_id_origen_informe_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_origen_informe_id_origen_informe_seq', 23, true);
          public          postgres    false    276            �           0    0 (   datos_solicitud_denuncia_id_denuncia_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_denuncia_id_denuncia_seq', 48, true);
          public          postgres    false    234            �           0    0 *   datos_solicitud_grabacion_id_grabacion_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_solicitud_grabacion_id_grabacion_seq', 39, true);
          public          postgres    false    236            �           0    0 .   datos_solicitud_responsable_id_responsable_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('public.datos_solicitud_responsable_id_responsable_seq', 39, true);
          public          postgres    false    238            �           0    0 (   datos_solicitud_usuarios_id_usuarios_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_solicitud_usuarios_id_usuarios_seq', 55, true);
          public          postgres    false    240            �           0    0 *   datos_tipos_informes_id_tipos_informes_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.datos_tipos_informes_id_tipos_informes_seq', 23, true);
          public          postgres    false    278            �           0    0 (   datos_ubicacion_informe_id_ubicacion_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_ubicacion_informe_id_ubicacion_seq', 23, true);
          public          postgres    false    282            �           0    0    datos_vehiculos_id_veh_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.datos_vehiculos_id_veh_seq', 5, true);
          public          postgres    false    242            �           0    0 (   datos_vehiculos_informe_id_vehiculos_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.datos_vehiculos_informe_id_vehiculos_seq', 21, true);
          public          postgres    false    280            �           0    0    doc_adjuntos_id_adjunto_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.doc_adjuntos_id_adjunto_seq', 107, true);
          public          postgres    false    244            �           0    0    expedientes_id_exp_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.expedientes_id_exp_seq', 106, true);
          public          postgres    false    246            �           0    0    glosas_ley_id_glosa_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.glosas_ley_id_glosa_seq', 4, true);
          public          postgres    false    249            �           0    0    informes_alfa_id_alfa_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.informes_alfa_id_alfa_seq', 43, true);
          public          postgres    false    252            �           0    0 (   informes_central_id_informes_central_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.informes_central_id_informes_central_seq', 12, true);
          public          postgres    false    285            �           0    0    infracciones_id_infraccion_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.infracciones_id_infraccion_seq', 65, true);
          public          postgres    false    254            �           0    0    inventario_grd_id_producto_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.inventario_grd_id_producto_seq', 75, true);
          public          postgres    false    256            �           0    0    leyes_id_ley_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.leyes_id_ley_seq', 4, true);
          public          postgres    false    258            �           0    0    origenes_id_origen_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.origenes_id_origen_seq', 19, true);
          public          postgres    false    260            �           0    0    productos_grd_id_productos_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.productos_grd_id_productos_seq', 69, true);
          public          postgres    false    262            �           0    0 1   reportes_servicios_central_id_reporte_service_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.reportes_servicios_central_id_reporte_service_seq', 5, true);
          public          postgres    false    264            �           0    0 "   sectores_alfa_id_sectores_alfa_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.sectores_alfa_id_sectores_alfa_seq', 27, true);
          public          postgres    false    267            �           0    0 %   solicitudes_imagenes_id_solicitud_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.solicitudes_imagenes_id_solicitud_seq', 50, true);
          public          postgres    false    269            �           0    0    tipo_reportes_id_tipo_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tipo_reportes_id_tipo_seq', 152, true);
          public          postgres    false    271            �           0    0    vehiculos_contri_id_v_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.vehiculos_contri_id_v_seq', 54, true);
          public          postgres    false    275            �           2606    33013 *   atencion_ciudadana atencion_ciudadana_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT atencion_ciudadana_pkey PRIMARY KEY (cod_atencion);
 T   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT atencion_ciudadana_pkey;
       public            postgres    false    217            	           2606    33015 "   contribuyentes contribuyentes_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT contribuyentes_pkey PRIMARY KEY (id_contri);
 L   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT contribuyentes_pkey;
       public            postgres    false    221                       2606    33017 $   danios_y_montos danios_y_montos_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT danios_y_montos_pkey PRIMARY KEY ("id_daños");
 N   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT danios_y_montos_pkey;
       public            postgres    false    223                       2606    33019 4   datos_atencion_procesos datos_atencion_procesos_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_procesos
    ADD CONSTRAINT datos_atencion_procesos_pkey PRIMARY KEY (id_atencion_proceso);
 ^   ALTER TABLE ONLY public.datos_atencion_procesos DROP CONSTRAINT datos_atencion_procesos_pkey;
       public            postgres    false    225                       2606    33021 0   datos_atencion_sector datos_atencion_sector_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.datos_atencion_sector
    ADD CONSTRAINT datos_atencion_sector_pkey PRIMARY KEY (id_atencion_sector);
 Z   ALTER TABLE ONLY public.datos_atencion_sector DROP CONSTRAINT datos_atencion_sector_pkey;
       public            postgres    false    227                       2606    33023 6   datos_atencion_solicitud datos_atencion_solicitud_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_solicitud
    ADD CONSTRAINT datos_atencion_solicitud_pkey PRIMARY KEY (id_atencion_solicitud);
 `   ALTER TABLE ONLY public.datos_atencion_solicitud DROP CONSTRAINT datos_atencion_solicitud_pkey;
       public            postgres    false    229                       2606    33025 2   datos_atencion_usuario datos_atencion_usuario_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_atencion_usuario
    ADD CONSTRAINT datos_atencion_usuario_pkey PRIMARY KEY (id_atencion_usuarios);
 \   ALTER TABLE ONLY public.datos_atencion_usuario DROP CONSTRAINT datos_atencion_usuario_pkey;
       public            postgres    false    231            T           2606    40990 .   datos_origen_informe datos_origen_informe_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_origen_informe
    ADD CONSTRAINT datos_origen_informe_pkey PRIMARY KEY (id_origen_informe);
 X   ALTER TABLE ONLY public.datos_origen_informe DROP CONSTRAINT datos_origen_informe_pkey;
       public            postgres    false    277                       2606    33027 6   datos_solicitud_denuncia datos_solicitud_denuncia_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.datos_solicitud_denuncia
    ADD CONSTRAINT datos_solicitud_denuncia_pkey PRIMARY KEY (id_denuncia);
 `   ALTER TABLE ONLY public.datos_solicitud_denuncia DROP CONSTRAINT datos_solicitud_denuncia_pkey;
       public            postgres    false    233                       2606    33029 8   datos_solicitud_grabacion datos_solicitud_grabacion_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_grabacion
    ADD CONSTRAINT datos_solicitud_grabacion_pkey PRIMARY KEY (id_grabacion);
 b   ALTER TABLE ONLY public.datos_solicitud_grabacion DROP CONSTRAINT datos_solicitud_grabacion_pkey;
       public            postgres    false    235                       2606    33031 <   datos_solicitud_responsable datos_solicitud_responsable_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_responsable
    ADD CONSTRAINT datos_solicitud_responsable_pkey PRIMARY KEY (id_responsable);
 f   ALTER TABLE ONLY public.datos_solicitud_responsable DROP CONSTRAINT datos_solicitud_responsable_pkey;
       public            postgres    false    237                       2606    33033 6   datos_solicitud_usuarios datos_solicitud_usuarios_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.datos_solicitud_usuarios
    ADD CONSTRAINT datos_solicitud_usuarios_pkey PRIMARY KEY (id_usuarios_img);
 `   ALTER TABLE ONLY public.datos_solicitud_usuarios DROP CONSTRAINT datos_solicitud_usuarios_pkey;
       public            postgres    false    239            V           2606    40999 .   datos_tipos_informes datos_tipos_informes_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.datos_tipos_informes
    ADD CONSTRAINT datos_tipos_informes_pkey PRIMARY KEY (id_tipos_informes);
 X   ALTER TABLE ONLY public.datos_tipos_informes DROP CONSTRAINT datos_tipos_informes_pkey;
       public            postgres    false    279            Z           2606    41017 4   datos_ubicacion_informe datos_ubicacion_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_ubicacion_informe
    ADD CONSTRAINT datos_ubicacion_informe_pkey PRIMARY KEY (id_ubicacion);
 ^   ALTER TABLE ONLY public.datos_ubicacion_informe DROP CONSTRAINT datos_ubicacion_informe_pkey;
       public            postgres    false    283            X           2606    41008 4   datos_vehiculos_informe datos_vehiculos_informe_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.datos_vehiculos_informe
    ADD CONSTRAINT datos_vehiculos_informe_pkey PRIMARY KEY (id_vehiculos);
 ^   ALTER TABLE ONLY public.datos_vehiculos_informe DROP CONSTRAINT datos_vehiculos_informe_pkey;
       public            postgres    false    281                       2606    33035 $   datos_vehiculos datos_vehiculos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.datos_vehiculos
    ADD CONSTRAINT datos_vehiculos_pkey PRIMARY KEY (id_veh);
 N   ALTER TABLE ONLY public.datos_vehiculos DROP CONSTRAINT datos_vehiculos_pkey;
       public            postgres    false    241            #           2606    33037    expedientes expedientes_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT expedientes_pkey PRIMARY KEY (id_expediente);
 F   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT expedientes_pkey;
       public            postgres    false    245            *           2606    33039    glosas_ley glosas_ley_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.glosas_ley
    ADD CONSTRAINT glosas_ley_pkey PRIMARY KEY (id_glosa);
 D   ALTER TABLE ONLY public.glosas_ley DROP CONSTRAINT glosas_ley_pkey;
       public            postgres    false    248            .           2606    33041     informes_alfa informes_alfa_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.informes_alfa
    ADD CONSTRAINT informes_alfa_pkey PRIMARY KEY (cod_alfa);
 J   ALTER TABLE ONLY public.informes_alfa DROP CONSTRAINT informes_alfa_pkey;
       public            postgres    false    251            _           2606    41059 &   informes_central informes_central_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT informes_central_pkey PRIMARY KEY (cod_informes_central);
 P   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT informes_central_pkey;
       public            postgres    false    284            1           2606    33043    infracciones infracciones_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT infracciones_pkey PRIMARY KEY (id_infraccion);
 H   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT infracciones_pkey;
       public            postgres    false    253            4           2606    33045 "   inventario_grd inventario_grd_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.inventario_grd
    ADD CONSTRAINT inventario_grd_pkey PRIMARY KEY (cod_producto);
 L   ALTER TABLE ONLY public.inventario_grd DROP CONSTRAINT inventario_grd_pkey;
       public            postgres    false    255            6           2606    33047    leyes leyes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.leyes
    ADD CONSTRAINT leyes_pkey PRIMARY KEY (id_ley);
 :   ALTER TABLE ONLY public.leyes DROP CONSTRAINT leyes_pkey;
       public            postgres    false    257            �           2606    33049    acciones pk_cod_accion 
   CONSTRAINT     \   ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT pk_cod_accion PRIMARY KEY (cod_accion);
 @   ALTER TABLE ONLY public.acciones DROP CONSTRAINT pk_cod_accion;
       public            postgres    false    215            !           2606    33051    doc_adjuntos pk_id_adjunto 
   CONSTRAINT     `   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT pk_id_adjunto PRIMARY KEY (id_adjunto);
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT pk_id_adjunto;
       public            postgres    false    243            (           2606    33053    funcionarios pk_id_funcionario 
   CONSTRAINT     h   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT pk_id_funcionario PRIMARY KEY (id_funcionario);
 H   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT pk_id_funcionario;
       public            postgres    false    247            ,           2606    33055    informantes pk_id_informante 
   CONSTRAINT     e   ALTER TABLE ONLY public.informantes
    ADD CONSTRAINT pk_id_informante PRIMARY KEY (id_informante);
 F   ALTER TABLE ONLY public.informantes DROP CONSTRAINT pk_id_informante;
       public            postgres    false    250            8           2606    33057    origenes pk_id_origen 
   CONSTRAINT     Z   ALTER TABLE ONLY public.origenes
    ADD CONSTRAINT pk_id_origen PRIMARY KEY (id_origen);
 ?   ALTER TABLE ONLY public.origenes DROP CONSTRAINT pk_id_origen;
       public            postgres    false    259                       2606    33059    central pk_id_reporte 
   CONSTRAINT     [   ALTER TABLE ONLY public.central
    ADD CONSTRAINT pk_id_reporte PRIMARY KEY (id_reporte);
 ?   ALTER TABLE ONLY public.central DROP CONSTRAINT pk_id_reporte;
       public            postgres    false    219            @           2606    33061    sectores pk_id_sector 
   CONSTRAINT     Z   ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT pk_id_sector PRIMARY KEY (id_sector);
 ?   ALTER TABLE ONLY public.sectores DROP CONSTRAINT pk_id_sector;
       public            postgres    false    265            K           2606    33063    tipo_reportes pk_id_tipo 
   CONSTRAINT     [   ALTER TABLE ONLY public.tipo_reportes
    ADD CONSTRAINT pk_id_tipo PRIMARY KEY (id_tipo);
 B   ALTER TABLE ONLY public.tipo_reportes DROP CONSTRAINT pk_id_tipo;
       public            postgres    false    270            M           2606    33065    usuarios_sistema pk_id_usuario 
   CONSTRAINT     d   ALTER TABLE ONLY public.usuarios_sistema
    ADD CONSTRAINT pk_id_usuario PRIMARY KEY (id_usuario);
 H   ALTER TABLE ONLY public.usuarios_sistema DROP CONSTRAINT pk_id_usuario;
       public            postgres    false    272            O           2606    33067    vehiculos pk_id_vehiculo 
   CONSTRAINT     _   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT pk_id_vehiculo PRIMARY KEY (id_vehiculo);
 B   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT pk_id_vehiculo;
       public            postgres    false    273            R           2606    33069     vehiculos_contri pk_id_vehiculos 
   CONSTRAINT     h   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT pk_id_vehiculos PRIMARY KEY (id_vehiculos);
 J   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT pk_id_vehiculos;
       public            postgres    false    274            C           2606    33071    sectores_alfa pk_sectores_alfa 
   CONSTRAINT     j   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT pk_sectores_alfa PRIMARY KEY (id_sectores_alfa);
 H   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT pk_sectores_alfa;
       public            postgres    false    266            <           2606    33073     productos_grd productos_grd_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT productos_grd_pkey PRIMARY KEY (id_productos_grd);
 J   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT productos_grd_pkey;
       public            postgres    false    261            >           2606    33075 :   reportes_servicios_central reportes_servicios_central_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.reportes_servicios_central
    ADD CONSTRAINT reportes_servicios_central_pkey PRIMARY KEY (cod_reporte_service);
 d   ALTER TABLE ONLY public.reportes_servicios_central DROP CONSTRAINT reportes_servicios_central_pkey;
       public            postgres    false    263            I           2606    33077 .   solicitudes_imagenes solicitudes_imagenes_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT solicitudes_imagenes_pkey PRIMARY KEY (cod_solicitud);
 X   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT solicitudes_imagenes_pkey;
       public            postgres    false    268            A           1259    33078    fki_fk_cod_alfa    INDEX     T   CREATE INDEX fki_fk_cod_alfa ON public.sectores_alfa USING btree (cod_alfa_sector);
 #   DROP INDEX public.fki_fk_cod_alfa;
       public            postgres    false    266            9           1259    33079    fki_fk_cod_producto    INDEX     U   CREATE INDEX fki_fk_cod_producto ON public.productos_grd USING btree (cod_producto);
 '   DROP INDEX public.fki_fk_cod_producto;
       public            postgres    false    261            :           1259    33080    fki_fk_cod_produncto    INDEX     V   CREATE INDEX fki_fk_cod_produncto ON public.productos_grd USING btree (cod_producto);
 (   DROP INDEX public.fki_fk_cod_produncto;
       public            postgres    false    261                       1259    33081    fki_fk_id_atencion    INDEX     R   CREATE INDEX fki_fk_id_atencion ON public.doc_adjuntos USING btree (id_atencion);
 &   DROP INDEX public.fki_fk_id_atencion;
       public            postgres    false    243            P           1259    33082    fki_fk_id_contri    INDEX     R   CREATE INDEX fki_fk_id_contri ON public.vehiculos_contri USING btree (id_contri);
 $   DROP INDEX public.fki_fk_id_contri;
       public            postgres    false    274            D           1259    33083    fki_fk_id_denuncia    INDEX     Z   CREATE INDEX fki_fk_id_denuncia ON public.solicitudes_imagenes USING btree (id_denuncia);
 &   DROP INDEX public.fki_fk_id_denuncia;
       public            postgres    false    268            /           1259    33084    fki_fk_id_expediente    INDEX     V   CREATE INDEX fki_fk_id_expediente ON public.infracciones USING btree (id_expediente);
 (   DROP INDEX public.fki_fk_id_expediente;
       public            postgres    false    253                        1259    33085    fki_fk_id_funcionario    INDEX     S   CREATE INDEX fki_fk_id_funcionario ON public.central USING btree (id_funcionario);
 )   DROP INDEX public.fki_fk_id_funcionario;
       public            postgres    false    219            E           1259    33086    fki_fk_id_grabacion    INDEX     \   CREATE INDEX fki_fk_id_grabacion ON public.solicitudes_imagenes USING btree (id_grabacion);
 '   DROP INDEX public.fki_fk_id_grabacion;
       public            postgres    false    268                       1259    33087    fki_fk_id_informante    INDEX     Q   CREATE INDEX fki_fk_id_informante ON public.central USING btree (id_informante);
 (   DROP INDEX public.fki_fk_id_informante;
       public            postgres    false    219            
           1259    33088    fki_fk_id_infraccion    INDEX     X   CREATE INDEX fki_fk_id_infraccion ON public.contribuyentes USING btree (id_infraccion);
 (   DROP INDEX public.fki_fk_id_infraccion;
       public            postgres    false    221            $           1259    33089    fki_fk_id_leyes    INDEX     K   CREATE INDEX fki_fk_id_leyes ON public.expedientes USING btree (id_leyes);
 #   DROP INDEX public.fki_fk_id_leyes;
       public            postgres    false    245                       1259    33090    fki_fk_id_origen    INDEX     I   CREATE INDEX fki_fk_id_origen ON public.central USING btree (id_origen);
 $   DROP INDEX public.fki_fk_id_origen;
       public            postgres    false    219            �           1259    33091    fki_fk_id_proceso    INDEX     _   CREATE INDEX fki_fk_id_proceso ON public.atencion_ciudadana USING btree (id_atencion_proceso);
 %   DROP INDEX public.fki_fk_id_proceso;
       public            postgres    false    217            2           1259    33092    fki_fk_id_productos_grd    INDEX     ^   CREATE INDEX fki_fk_id_productos_grd ON public.inventario_grd USING btree (id_productos_grd);
 +   DROP INDEX public.fki_fk_id_productos_grd;
       public            postgres    false    255            �           1259    33093    fki_fk_id_reporte    INDEX     M   CREATE INDEX fki_fk_id_reporte ON public.acciones USING btree (id_atencion);
 %   DROP INDEX public.fki_fk_id_reporte;
       public            postgres    false    215            F           1259    33094    fki_fk_id_responsable    INDEX     `   CREATE INDEX fki_fk_id_responsable ON public.solicitudes_imagenes USING btree (id_responsable);
 )   DROP INDEX public.fki_fk_id_responsable;
       public            postgres    false    268                       1259    33095    fki_fk_id_sector    INDEX     I   CREATE INDEX fki_fk_id_sector ON public.central USING btree (id_sector);
 $   DROP INDEX public.fki_fk_id_sector;
       public            postgres    false    219            �           1259    33096    fki_fk_id_solicitud    INDEX     c   CREATE INDEX fki_fk_id_solicitud ON public.atencion_ciudadana USING btree (id_atencion_solicitud);
 '   DROP INDEX public.fki_fk_id_solicitud;
       public            postgres    false    217                       1259    33097    fki_fk_id_tipo_reporte    INDEX     U   CREATE INDEX fki_fk_id_tipo_reporte ON public.central USING btree (id_tipo_reporte);
 *   DROP INDEX public.fki_fk_id_tipo_reporte;
       public            postgres    false    219            [           1259    41060    fki_fk_id_tipos_informes    INDEX     a   CREATE INDEX fki_fk_id_tipos_informes ON public.informes_central USING btree (id_tipos_informe);
 ,   DROP INDEX public.fki_fk_id_tipos_informes;
       public            postgres    false    284            \           1259    41061    fki_fk_id_ubicacion_informes    INDEX     i   CREATE INDEX fki_fk_id_ubicacion_informes ON public.informes_central USING btree (id_ubicacion_informe);
 0   DROP INDEX public.fki_fk_id_ubicacion_informes;
       public            postgres    false    284                       1259    33098    fki_fk_id_user    INDEX     M   CREATE INDEX fki_fk_id_user ON public.central USING btree (id_user_central);
 "   DROP INDEX public.fki_fk_id_user;
       public            postgres    false    219            �           1259    33099    fki_fk_id_usuario    INDEX     _   CREATE INDEX fki_fk_id_usuario ON public.atencion_ciudadana USING btree (id_atencion_usuario);
 %   DROP INDEX public.fki_fk_id_usuario;
       public            postgres    false    217            G           1259    33100    fki_fk_id_usuarios    INDEX     ^   CREATE INDEX fki_fk_id_usuarios ON public.solicitudes_imagenes USING btree (id_usuarios_img);
 &   DROP INDEX public.fki_fk_id_usuarios;
       public            postgres    false    268            %           1259    33101    fki_fk_id_vehiculo    INDEX     R   CREATE INDEX fki_fk_id_vehiculo ON public.funcionarios USING btree (id_vehiculo);
 &   DROP INDEX public.fki_fk_id_vehiculo;
       public            postgres    false    247            ]           1259    41062    fki_fk_id_vehiculo_informe    INDEX     f   CREATE INDEX fki_fk_id_vehiculo_informe ON public.informes_central USING btree (id_vehiculo_informe);
 .   DROP INDEX public.fki_fk_id_vehiculo_informe;
       public            postgres    false    284            &           1259    33102    fki_fk_id_vehiculos    INDEX     S   CREATE INDEX fki_fk_id_vehiculos ON public.funcionarios USING btree (id_vehiculo);
 '   DROP INDEX public.fki_fk_id_vehiculos;
       public            postgres    false    247            �           2620    33103 &   solicitudes_imagenes cod_imagenes_soli    TRIGGER     �   CREATE TRIGGER cod_imagenes_soli BEFORE INSERT ON public.solicitudes_imagenes FOR EACH ROW EXECUTE FUNCTION public.codigo_imagenes();
 ?   DROP TRIGGER cod_imagenes_soli ON public.solicitudes_imagenes;
       public          postgres    false    290    268            �           2620    33104    informes_alfa codigo_ALFA    TRIGGER     w   CREATE TRIGGER "codigo_ALFA" BEFORE INSERT ON public.informes_alfa FOR EACH ROW EXECUTE FUNCTION public.codigo_alfa();
 4   DROP TRIGGER "codigo_ALFA" ON public.informes_alfa;
       public          postgres    false    251    287            �           2620    33105 ,   atencion_ciudadana codigo_atencion_ciudadana    TRIGGER     �   CREATE TRIGGER codigo_atencion_ciudadana BEFORE INSERT ON public.atencion_ciudadana FOR EACH ROW EXECUTE FUNCTION public.codigo_atencion();
 E   DROP TRIGGER codigo_atencion_ciudadana ON public.atencion_ciudadana;
       public          postgres    false    288    217            �           2620    41063     informes_central codigo_informes    TRIGGER        CREATE TRIGGER codigo_informes BEFORE INSERT ON public.informes_central FOR EACH ROW EXECUTE FUNCTION public.codigo_informe();
 9   DROP TRIGGER codigo_informes ON public.informes_central;
       public          postgres    false    294    284            �           2620    33106    inventario_grd codigo_producto    TRIGGER     �   CREATE TRIGGER codigo_producto BEFORE INSERT ON public.inventario_grd FOR EACH ROW EXECUTE FUNCTION public.codigo_inventario();
 7   DROP TRIGGER codigo_producto ON public.inventario_grd;
       public          postgres    false    255    291            �           2620    33107 )   reportes_servicios_central codigo_service    TRIGGER     �   CREATE TRIGGER codigo_service BEFORE INSERT ON public.reportes_servicios_central FOR EACH ROW EXECUTE FUNCTION public.codigo_servicio();
 B   DROP TRIGGER codigo_service ON public.reportes_servicios_central;
       public          postgres    false    292    263            �           2620    33108 %   expedientes trigger_codigo_expediente    TRIGGER     �   CREATE TRIGGER trigger_codigo_expediente BEFORE INSERT ON public.expedientes FOR EACH ROW EXECUTE FUNCTION public.codigo_expedientes();
 >   DROP TRIGGER trigger_codigo_expediente ON public.expedientes;
       public          postgres    false    245    289            �           2620    33109    productos_grd valor_total    TRIGGER     �   CREATE TRIGGER valor_total BEFORE INSERT OR UPDATE OF precio_unitario, existencias ON public.productos_grd FOR EACH ROW EXECUTE FUNCTION public.actualizar_valor_total();
 2   DROP TRIGGER valor_total ON public.productos_grd;
       public          postgres    false    286    261    261    261            v           2606    33110    sectores_alfa fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.sectores_alfa
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY (cod_alfa_sector) REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.sectores_alfa DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    4910    266    251            l           2606    33115    danios_y_montos fk_cod_alfa    FK CONSTRAINT     �   ALTER TABLE ONLY public.danios_y_montos
    ADD CONSTRAINT fk_cod_alfa FOREIGN KEY ("cod_alfa_daños") REFERENCES public.informes_alfa(cod_alfa) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.danios_y_montos DROP CONSTRAINT fk_cod_alfa;
       public          postgres    false    223    4910    251            u           2606    33120    productos_grd fk_cod_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos_grd
    ADD CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) REFERENCES public.inventario_grd(cod_producto) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.productos_grd DROP CONSTRAINT fk_cod_producto;
       public          postgres    false    255    261    4916            {           2606    33125 !   vehiculos_contri fk_contribuyente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_contribuyente FOREIGN KEY (id_contri) REFERENCES public.contribuyentes(id_contri) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_contribuyente;
       public          postgres    false    274    4873    221            t           2606    33130    infracciones fk_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.infracciones
    ADD CONSTRAINT fk_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.infracciones DROP CONSTRAINT fk_expediente;
       public          postgres    false    253    245    4899            m           2606    33135    doc_adjuntos fk_id_atencion    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_atencion FOREIGN KEY (id_atencion) REFERENCES public.atencion_ciudadana(cod_atencion);
 E   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_atencion;
       public          postgres    false    4860    217    243            w           2606    33140 #   solicitudes_imagenes fk_id_denuncia    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_denuncia FOREIGN KEY (id_denuncia) REFERENCES public.datos_solicitud_denuncia(id_denuncia) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_denuncia;
       public          postgres    false    233    268    4886            j           2606    33145    contribuyentes fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 I   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    245    221    4899            |           2606    33150 !   vehiculos_contri fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos_contri
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 K   ALTER TABLE ONLY public.vehiculos_contri DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    274    245    4899            n           2606    33155    doc_adjuntos fk_id_expediente    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_expediente FOREIGN KEY (id_expediente) REFERENCES public.expedientes(id_expediente);
 G   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_expediente;
       public          postgres    false    245    243    4899            d           2606    33160    central fk_id_funcionario    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_funcionario;
       public          postgres    false    247    4904    219            x           2606    33165 $   solicitudes_imagenes fk_id_grabacion    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_grabacion FOREIGN KEY (id_grabacion) REFERENCES public.datos_solicitud_grabacion(id_grabacion) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_grabacion;
       public          postgres    false    268    4888    235            e           2606    33170    central fk_id_informante    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_informante FOREIGN KEY (id_informante) REFERENCES public.informantes(id_informante);
 B   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_informante;
       public          postgres    false    250    219    4908            p           2606    33175    expedientes fk_id_inspector    FK CONSTRAINT     �   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_inspector FOREIGN KEY (id_inspector) REFERENCES public.funcionarios(id_funcionario);
 E   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_inspector;
       public          postgres    false    247    4904    245            q           2606    33180    expedientes fk_id_leyes    FK CONSTRAINT     {   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_leyes FOREIGN KEY (id_leyes) REFERENCES public.leyes(id_ley);
 A   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_leyes;
       public          postgres    false    4918    245    257            f           2606    33185    central fk_id_origen    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES public.origenes(id_origen);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    259    219    4920            }           2606    41064    informes_central fk_id_origen    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_origen FOREIGN KEY (id_origen_informe) REFERENCES public.datos_origen_informe(id_origen_informe);
 G   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_origen;
       public          postgres    false    277    4948    284            r           2606    33190    expedientes fk_id_patrullero    FK CONSTRAINT     �   ALTER TABLE ONLY public.expedientes
    ADD CONSTRAINT fk_id_patrullero FOREIGN KEY (id_patrullero) REFERENCES public.funcionarios(id_funcionario);
 F   ALTER TABLE ONLY public.expedientes DROP CONSTRAINT fk_id_patrullero;
       public          postgres    false    245    4904    247            `           2606    33195     atencion_ciudadana fk_id_proceso    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_proceso FOREIGN KEY (id_atencion_proceso) REFERENCES public.datos_atencion_procesos(id_atencion_proceso) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_proceso;
       public          postgres    false    225    4878    217            o           2606    33200    doc_adjuntos fk_id_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.doc_adjuntos
    ADD CONSTRAINT fk_id_reporte FOREIGN KEY (id_reporte) REFERENCES public.central(id_reporte) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.doc_adjuntos DROP CONSTRAINT fk_id_reporte;
       public          postgres    false    219    243    4871            y           2606    33205 &   solicitudes_imagenes fk_id_responsable    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_responsable FOREIGN KEY (id_responsable) REFERENCES public.datos_solicitud_responsable(id_responsable) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_responsable;
       public          postgres    false    237    268    4890            g           2606    33210    central fk_id_sector    FK CONSTRAINT        ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_sector) REFERENCES public.sectores(id_sector);
 >   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_sector;
       public          postgres    false    265    219    4928            a           2606    33215    atencion_ciudadana fk_id_sector    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_sector FOREIGN KEY (id_atencion_sector) REFERENCES public.datos_atencion_sector(id_atencion_sector) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_sector;
       public          postgres    false    217    4880    227            b           2606    33220 "   atencion_ciudadana fk_id_solicitud    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_solicitud FOREIGN KEY (id_atencion_solicitud) REFERENCES public.datos_atencion_solicitud(id_atencion_solicitud) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_solicitud;
       public          postgres    false    229    4882    217            h           2606    33225    central fk_id_tipo_reporte    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_tipo_reporte FOREIGN KEY (id_tipo_reporte) REFERENCES public.tipo_reportes(id_tipo);
 D   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_tipo_reporte;
       public          postgres    false    4939    219    270            ~           2606    41069 %   informes_central fk_id_tipos_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_tipos_informes FOREIGN KEY (id_tipos_informe) REFERENCES public.datos_tipos_informes(id_tipos_informes);
 O   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_tipos_informes;
       public          postgres    false    279    4950    284                       2606    41074 )   informes_central fk_id_ubicacion_informes    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_ubicacion_informes FOREIGN KEY (id_ubicacion_informe) REFERENCES public.datos_ubicacion_informe(id_ubicacion);
 S   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_ubicacion_informes;
       public          postgres    false    4954    284    283            i           2606    33230    central fk_id_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.central
    ADD CONSTRAINT fk_id_user FOREIGN KEY (id_user_central) REFERENCES public.usuarios_sistema(id_usuario);
 <   ALTER TABLE ONLY public.central DROP CONSTRAINT fk_id_user;
       public          postgres    false    219    4941    272            c           2606    33235     atencion_ciudadana fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.atencion_ciudadana
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_atencion_usuario) REFERENCES public.datos_atencion_usuario(id_atencion_usuarios) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.atencion_ciudadana DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    4884    217    231            z           2606    33240 #   solicitudes_imagenes fk_id_usuarios    FK CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_imagenes
    ADD CONSTRAINT fk_id_usuarios FOREIGN KEY (id_usuarios_img) REFERENCES public.datos_solicitud_usuarios(id_usuarios_img) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.solicitudes_imagenes DROP CONSTRAINT fk_id_usuarios;
       public          postgres    false    268    239    4892            �           2606    41079 '   informes_central fk_id_vehiculo_informe    FK CONSTRAINT     �   ALTER TABLE ONLY public.informes_central
    ADD CONSTRAINT fk_id_vehiculo_informe FOREIGN KEY (id_vehiculo_informe) REFERENCES public.datos_vehiculos_informe(id_vehiculos);
 Q   ALTER TABLE ONLY public.informes_central DROP CONSTRAINT fk_id_vehiculo_informe;
       public          postgres    false    284    4952    281            s           2606    33245    funcionarios fk_id_vehiculos    FK CONSTRAINT     �   ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT fk_id_vehiculos FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculos(id_vehiculo);
 F   ALTER TABLE ONLY public.funcionarios DROP CONSTRAINT fk_id_vehiculos;
       public          postgres    false    247    273    4943            k           2606    33250    contribuyentes fk_infraccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.contribuyentes
    ADD CONSTRAINT fk_infraccion FOREIGN KEY (id_infraccion) REFERENCES public.infracciones(id_infraccion) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.contribuyentes DROP CONSTRAINT fk_infraccion;
       public          postgres    false    253    221    4913               Z  x���KR�0D��)t�P��?�qN���e�X�(n�<v�X8PTɛ�ףV{r"���d�87x�=�*_��ܳe�d��0ႇÄ0�\^��!�H
&����L�̔Ɋ�`$���׃{�쓹��maY�±ҷ��j��3	9�9`���a�vE�׸��\ݻU�gɭy,�X���bA��\`c�����r�������%�e��:��� ���XǾg��l���
��Hi4��)�S�c�����â��_��'l�!D�ǩ��۹��C=��3�Lt�CdT�L���n .��ڼI�+�r>�[Sd��z��{-�zCg�w���a	�;>PJ� ��k         }   x���C1Cki���o�]�� i��4���1���'�O�a��*.\��]qC�B"����ì��,���8�S��o���LEukIV}�����,g���9Z6O���j����"�[�#w            x��Msۺ�L�
�O�T���s���6o�c'i3/9 &m3O&e���M�?��z��'��'H��$(v�4cE$D�b��]`�����A����3�`��aDAb��0��O-+�A�us��ǖ�����:8=>����i�F��GG����c}ٝ�|���%yd�;�/w��1�PH=��!������*��̣8�w����*:�O{���O܆��u��y��;�u["��g�v�X\�<㳙e��azY�c�,��xyI�����0��u�wH@Fu�!`�<����@B`��/>�$ן�4���D|��_��._�?��_��,<?���7�Z^�i"��v;TaM#ڝ�ʌI�������Z_v��;�lH�6	ޠW��}
ֵ����U���J���o���A"�;�`�4��[y����0��i��n�����sC,�A�(��Ђ���O>P_+��4uZ%�����nS�{r%�Y������J�Jl�Cb+�d�ΛhsҮA��0S�2S�<����"��P�b)����8:�fbr{���$�F�4
�ˤ����6�-�S���E՞H˴�^�WV������Q�T�'<O��)�,�zx+zݶf_��3����OЍ[�aK�e��b�䠖> �[���s4\66��bzNb	$k(̖jg�!M�8l��ҁ4t�{�<��*a�?&/�h�(26��w�E����8O�(����t�S��ߙ��nSX�+{;�1�h�ky���}�R�����,�;{����j��]K�O�C�������ѹ,~��X��Ә�4H�%�v�ǓK�D�?ZƽEx.n
^EIOSx*�0���<�!cp��|�Pe��+�d_� ������kPh�����קC��m���I���Nk�kE��5��̫tV�S)ZƴEx��������~D��=J |{!�7�p����bs ]@��'۷�-POp�ڂ#x���:r
��;����TD}nE4�v����y�ˋW���c^I�H��C��6�Ռ:ͯ���pb��}��.���^�#���	��.u!#=��΅���\��s�B���ǯ��qZJG�rv�E,莹mu�,��u���������2��Q�7���6���D�5h�n�'EX�H��!x5��X�~��K3 �E#i�,�U޲�t���fj��Scן֮ɡ�P�n��R �S�U�nm�޷\�U���������-�B�X���~*��i�L�w���'0���U��C�v����Қ���,�`������l�!m�rd�|x�s�6!qk��2j؈�A��ޮ �*�nɻ��[�%��"(H�$Y�'����jAC���ʙ�����ë́��, x�m���Tet�,(�����]^]\�/�[(�S�$��S�	zq���l���A������7K��N�Y��}^o3���d0c|�e��h�%e{�ږ��ζ���N�� ���q����q���:��q��C��!0cƻ̞�Lz�2�ˤg,���Lz�2�m"�_����&R)�se��� �DH��Df�d+�0j�u�3�&����:��o�Iߜ��v�7��p�Dc�
��P႙�$�A6Da�T����`u����Y�v���w��_�rBV���������}�R�V���ND2�ҿ�΢���a;�ц��Ts*�������t..y'?�E&n../���l�(�����?U�3-d�$���}9P���=�˰���>e�<g�csՖ�xcx�L�b4��P����7���A�lה[L?��g"�������O136n�8d��t�q<�����'�޽^.A?��5d��&)@��l�%�u���]�m9�jB�I�dx�?}��/�A�5<t�#�NyO�*A�Q𓡄<2%��C�Ȱ0%yخ�tJ �|��SEiK�H���j+�}�K9wi"2D����!"���h��_��L�!�l`ƛ:[��0�����Ð=�E�Om�5�>�@nr���O� �7kSB
��������P��^)��c�}]^3��t��s�G����K�Hn�>����-��}���Ap�CtW8�+ov��*�1H�E@���?&���_��~��x�|�#}�R~m�&�ä́�	��`�j�G��pݖY����n���a�ٓ�;�`d�x	��I�xd�{}���~߈�]�p���	_�s`����!�-�)�[��,���z�;{T��cbg�1ClFV��U��d4�`�/<"s��|��8���ȼR�ۜ���Ք҈G!��9Տ���G��@!�z���ۅt=V�5BL�����`�@�<��a�����Ȑ:z�9��S9�)�ZxOd�����"�+��s�Gܝb�<������t��KQ���U<<<��_޽r'�ق�W����É���,�'����9�ă�<h��Ks� ��+�=�`O��̤�B�m�XQ���B���ߊ?~ų@�/�W�8�Yn�	6��ugy���4��dj�a���~b��Q��oc��b��v�S��2�C}*©��aË���j=��l΅��Jq��!M��!�ntvB-�$�d:3��OC��ۣlƿ���;>p�\�*Va��1�m�[���\�dE��ZlYqr<��\�N�
TB��>�Ӝ����GqC�"����k�����,��7Ļ��}(]Nm�,�\C�I���K>U����`��T+u"�AN�5b�O"R�G!�Y�e�o:�^�@OE'����ݘ���'<���
,�"��ơ�q��ͺ��J|L�B�m����^c}��o�y�cA�o��}WC��"�� ,��@ZXQj��:A9�J���A҈Ď���c��b).��8��,u;)�|����I�I����AS�mp���/�8+/������~�����ic��Tq���H���W�R��X�E�.ndB|�H5��a��r�i�B�[4L>R*���QqӺ#CE�Y���VcVT�<^�yD�G���aigh�����������ٮ           x�}��N�0���S� 5���+�p���.��$+��}#��aDN�ȿ/rl��2P���Y��~7����s�f{����S��<�*u�}��D�$�Mb~I[2V�<�WI�(��-G�F���E�
ȫ"/��������9?��\WȋQ��P�\H2H?]�&#]!�d1�0-U�����8^�.�΂ddM�͕պ�x�����Ԙ隱��Ԡ��!�]7���.ݓ�0x7�{k�ɇnr���@���ʬ�h�r�(2��Z5��U��K��          X  x���Mn�0F���봊!]w�d3`� �U�C��XMB�ȦEba3|��A���'���[�e�s�KS>Mܟءf�KcQ������k)z��/7�a�Mܚ����!�5r��*օ��i�N�g��ĸ��T`�t.��A7�]e�B�=��M�/u��(sK�yBA�VE����)�{)m����.q��N���]"'�tKy�Pk��}Ў�����;��=TX`w�/!Í�t��I���%��fH��M&B���D��X�'�9[7Hh��`2�T�orĶ�UqP�X`�#_��5����߱��ǔ���n��y�ܯ�8��?EQ��*b[      "   �   x���A��0E��)zF�Kh�! �Y��4X���Ϥb��TH^��?���ح�9��&���;-�Fb^��e��y��P���F-�ĕ;���8DC�~	��~�tg��7�δN�O��@L���L{�˧QՃ�NF�κ���~�j�@��!G	��Y�ę�t��K�/Qt�|�F�N����y�ջ���
(�߷��n�%����-      $   X   x�3�,(�OJ�K�W��� .c\��$�pI�㒰�L,J�HLI�����D�p�)CN���3T�9�\�ц�\T�c���� �	?�      &   �   x�uOK�0]wN�	�5��J"��)�	!5zz���&�4�;����!)O�J��0��	���Ƅ,&��&�m�C(��&M�e��"84�트W����4�ܺ0�PƄ!���)���Gn��'�f�
�	�u��^h�0���h�m��8L��2_��Z��EӤ��������� v�S���f�7 �+|�      (   �   x�u�K
�0@�3��	B'�i��'PA��DC������5U�b��������g���r���y(9P���Tia�4��G�����}L���'h`��c븒ɀ�M�~��T��[�����>6��K1.3��ݔ6��6�4~�:Dl"� ��f�      V   �   x���A�0E��)z�$�	��2]�:)o/�Ȋ��������e�\`��"D��:��#���;�ƀt��wx�`��St���%T�B�+�\�#�u�p����O�z���ƱG3U	 �@7L���q�m���^\9Z_��r��m�eq�˚ܬ�f7�2vۓR���      *     x�}��n�0���S�	&b'm���icl.֒�2�hIA{���t������?��`�7�%�K4����z/�ڊ��|,c��;+q��t���0U�����sG��.���Жu{+���mlnV�����4����Yw�.��������Aֶ���{�}�SQ�bb�#p�&et�T���	�W'��8�n�4�F�J���K�<��mOj�Y�X_�dJ9X_�Ⱥo�X>���r�@6@m��0>t�"�2���$a�0%�	�sx�?�ь���~����� {괬      ,   &  x���Mn�0���)x��II��,�m����flR?�B�$��*z�\�#ډdG�Q�d����py�?�E|bLL�%����Mm�r�b:'fs�bN���%���4�Z	^��,��ټ����(K夢?���dd��z�c����1ʲ[�oc̬�%Ȣ$���z�]��WGlAdQ��ߊt��&�;���!�X������'/��$����^ElI�;e�'��,gWR�1I|��٢\L��ڗ��E�N.D�Q8Y��⇼�� `���X\)O��� �<Eyؖ�/d��ǧկ��հV��rG|Av~o��	���	>�0��'��V�h��fɡ
"&T����ӫ�%���?����clܫ0?&<��م�q8������	�!����dڌCѾ�@[�ո%zrڌ�]���Y5`I��2Z,'-4�����h�p��f�X�982\]H��u�)hotm�������5�4�K�7���m%o?�Po}�����p^{U��Wk��i�B[�����Wh̣�Tw����#��=>�������      .   �   x����
�0E��W�J�hK�.|��s��lRj���������@�KN2	������pQ�� O��K#c�.���d
�%'[>يɶ��Av���w�㷎���PYl�}Օ�iP��ee��4�hKTE���xt�|2A�)���G_&Ф�%��Q5Va���I��@���52D���7)�#��Hou��D�#8�K�궡2퓱���2�R�]��q      0   @  x���An� E��)�@"��!Y�m�v�1زd�������H!�$K���g���pzg���vb�%��I�O�a���T�џ����ਯ�a0	���#E�<"oH�z:]�	�X��e�W_����֍��Ϗ��X&ak@	�aі�Q��
F[�L���x�E�&�򆯏Q�j�F\f������G����z(�/��?:n�KP�gC��D��6�f���u&�t.�9�GF��&���$���C.	� H��P����7m��|O����1��rv,�����a���y���wm�s	.V.�̭`ՑӞ�$�/      X   �   x���Q�0���S� ���%</[��p�`��O�����Mkh�R2�1Hm���`�zO��N^1�.��s�s_<r�&G*�,�E��v���yZ��5 h5�Ҽ �� �c�ypvXp�,F�
��ܨ��e���v3���lq=��g�f6>�9��$��Y���A      \   }   x���A
1���)z �Q�Yz�n
�DE1z��p!�����GF���>M϶����A-��P�KK~\3�z��c�ï�6-�m��&�K=J+��O\j����3��O7 _׍��%��|W      2   Z   x�5�K
�0Eѱo]��Ow�TB%R�?R��.\Nݾ��R����V���݆�R�.4���
q!!$����)8�\PJA!����2�      Z   C   x�3��".s(m�a#��0�1�`sNN.Ca	$�@�!�k�Y�d\R���� �g�      4   �  x����n�@���)�2�X�3{�DUDWv��D���I�c�<@�oԾX����ZUZ���?��i0�^�g�dp_t#���Wb�LP�f�ru��%P`{�ͦ-a���/�j��r'ֱyД���?Ct��7�z{Z��'����Q�J;�n �%��ʤ	��\r��)6��������v�%qTϟ~+�������l�N`7�"�]�N�t
\"'yBp=A��F��뎐��-C#�2�Z��(Y���0J!����8�~|��� %���<%	x�Ð�7�r�I(KHl�|�fU���5�{��\m^�%0���c��C�:0$�-��zٴ�kg�<�6��V�:�+�g�0ؽg}���f�1A.w=���R-���}�\�븮!�.�I1��k([@��HtrbR��\�ty��Jbw �^��!�5�V]�h��ݘ~HP��Q�?�      6   w  x���Mn�0���)x���m/�E�Mk$�.ZV����Ez��z�\�×�-Ǣk����Ӑ߈3I��f��}��t{7R3�v���(2�.���S��L�Y�%�>�����˟:难H��_lҷ�kJ��tg�%���	!��H-��5�r&`��+��o]�����}��D?����L�m�G��{7�(Jo��ŭ]��t��@b���HLQb�'���W�CS��^y�r�oY�k6�ׂ.�}�X[�}A_; ���p�Hq�p����(��ք�b,�ݪ٪`u_l��0�����*�)����c>(#~��Z�-�-�	�Њ(-ʔb��E`�"
� `a���+l�Lš�g�7�M����&�MFq��&��Ip�Q�4Xh�X��qe	���/�;�״E#c�$E]��4��	�����uU���y������FQh��vq\l@π^����(��Q'���}�(��A��U��}b�gO�o;Z�ʱ�BY�l`��f�|G���5b���A�b�eP���ب�ӂ���Hf�35(�p^�K-U�<N��c�&<b�RV�s,��������-����^�l��3�B���-�����7�v��P���ݼ�>�T������_�c��      8   x   x�r2�,-.M,��W((*MMJT0�,� I��qiSt�PƜ�~� %��J�1���+1�[Sb����$  (�]�!gЕpityTy�
�A.5@H�%Fp�*����� ��[K      9   %   x�3�L��/NT0�2������,c.(˄+F��� �a      ;   I   x��r���K�/�M�+IUHIU((*MMJT0�4426153�����2��D(��1ⴴ0735162����� �	7      <   G  x��R=o�0�Ͽ�b���G�*U�:�CY#UGb���IM��k���Bi��=Y���=�c�x""� yYh�Rn�8:&I@�QN����۶����L�P\*8�~���΋��g�z�X*�_J+����S��X��ʛ�(��k���֥5%ș�r�R����f��Ҏ)����P�)y6�k]T����}�� �	z�%��
g�(k͝�l�v$@�oș�W���ȟ�;���S" ^v��dFè1�ÈKX#*J��xZ ?� �i���֊�����#�LIPr���G�n/܅�w���f"�}�R������� �No>�����)c�,�      ]   f   x�=�;
1��z�0�G~�ir���1Z[�������|����e(�����B��ykP���:��ͣsz���iP��:�M��[׶#q}�u�|������&p      >   X  x��S�n�0=㯠�)��@8n�M��C��x�e�:ZQ��P���=�{vL�����2�H�u��x!n(~��ש�۷PD�4D�;�����~�"��H9P6�|����� ���gi�wrI�rI�r��[k,/�.1����m�J1Z�0C��r@z���1�A┇�_�)a�TX�R�Ej�.R f%'���(%Z�P��`�rRE��p���J��t���!uy�[�ധ��� ��0m���V$�I�1�T���)�fI�T�YR s$g��Y�'���z��M܄x�z�@�D�zh��3�p���0V��a�N���	 � ���      @   4  x��T�n�0�W_�>p�%wɓ��q��n�(�9EX�������;Q9��S8��هDz�^"QT��bQ���=�{�8v��9G��h#�ާ�{	��?��q&D������[���C�z��;�����^�4r0�ìV38��.��1���7@#ƭHZD461#��y,���q�_N:j���<�	ߣ��-!TŞQ~F�w�Ԩ�7Zjd%��p{	|%
�/D	���bl/E�����}�=�٬	j��= ���9j�]h�Q����w%��AU�e �pu�F�!�ά� s�y��3�6�s�j*�f�rm����-6 �-��/(Uޒ�����m#�2&b2aqn����: -���(�2�s��L�r�����lg e�wKS�X��,���n�m�h,s��q�Hux��J�kyy_��O�>�eT�:�Q��uT�S| ����c9p��+&ceRm�4�y�F&���:�9���f<�_ƌ�����n�����c?���_��Ш�6�pFB�{����@���咄�	���� K%>_t�
`� ~�	W�
�r��y|�4�/$u�      B   #   x�3��I�T0�2��\F`ڈ�Lr��qqq �Y1      D     x�M�Mn�@���)�U��!��(�n��A��	OP{�����հ(�l?���la�6�H��A��q�V}�UE��p�I��r
)����w������{>�����mp�[�5Hps�Sg<���)<�$>��N�b��n|�9��u�>�"ȑ��NݮX��%[U�m4��"�,+�}Xg�+��\�]]�2�H'�ʧ��Q�gRm�EQ+�N.�ǰ%�Aa'�=�؉ٷj,]y��J/��b��B���"���q�      F   6  x��U�n�0</�B_`�䒲�v��KQ��QˏƅIn���,iɏ(�z0E;�;�;�֫��zא6�;z����:PX������d�+��Ou�T��L�O��b��������_2=q�l��{��7	Z��\A�����>���A�Ql���[�Uc��;坭�sA���7�`1�d/�M��=����`�/O��cq�
�՜4tȒt^<���D�ҍĒ�E�]��o!N�v0�ȏj@^�/�ڄ�׶i���f@DN��+a�9R~ѲL1���lW��.��R�P�K���.�ɜ/7dD����^{n�$|IR���k�{���*Ο\l7�l�BO���S�w��s� r�!�E��QH���7�t�C�uT���G�N��M��ؽk焇r��^Ɂp((+.�		�)�ݥ�V�~���+�Mf��Х��8�x�U���S}w8�~f5����؜~��c(�m"kk
[.0M�Jr�5�MU�v��i�c����n8���-���f�2�K���X~���f٧��L����εT���?���b      H   o   x�3�t
3�4202�50�52R00�20�20�,NLI�,/�LKOKLI���A������������4�(3_���,5#3�4����L�������@����� ��#      J   9   x�s
�s�tJ,*J�KN,��-JJ�K�
����N�S�*M���*-J������ v      K   �   x�3��CC\�X���a3�ŉy%��7���%���*JRa�D�C#]##.,�[bs�)g�BPjz���y���y
�@�2�Q�E��I�
���&��̈�fh� u��9���p�%�p�C���qqq !�g      M   D  x�M�Kn�0C��a�H��9A�E��v��R�d� ��6r�߯��9��+�����O�X�}��8�u����kY�ȷ�-S�#��6�̲Y�HD�&F^�Bi���mN��L����H���y�Hz�;�uW��|>T��C�IUQPC�I�(�
@�,�+���T3�̮+��V��-��%@��t�� %V[�k	P"ZȀ��D�Pw����&P�{��@�-���	T���t7�
�Z8��&P���t7�GOܺ��&��%nAwx��3�n��zb�t7afO��t7aVO��ta���{L���1���������4      O   �  x��X�r�6]�_��*�%�Ai�i��=��=n�W�I��$4 ���7YfыTv�Տ͹ %2��ꪖy���8���Ɍ]��7-7R)�X�$-�r���6I)#����t2gW����6�;aZ}i��f#L��ck�,��P���'x����'��s%�ѷ-�߹�Wߺ ;-�JT\�aV�V���W��R�N�����fW;i[^KѴ�L�V]�p����zd�t��5���<��$;�(�Nq3�jZ�6��f'���Ekd��@��@9��4��p-7���x��7;�;U�5�/�܈��N��*Ey����'��aG![�`���ܠʺ���Fp�nMIFt��eKvM�ڽ�Q�F��ѣ�eG�����d��"W즔d8ߔ�yŁ5��>�c�;�������-E�ZS
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
�}M�Ҩͦ�){�T�;��8b�`髰�}S�2�Ml�� �qd����j٫�o?sb����:��<��{����7�����CK�g�G�X�[Y^x��mƾO�Y(a���_i�w�r�Xh��py�>J�E�|��ė��/��mZ�����w�zZ�t����Q��7���ET�'o$��eN���5��ᕥ��=�|�i�n���}�4�������*v�      Q      x������ � �      R   U   x�r�,K��L.��W((*MMJT0�LN����K-I�
*0B�HI�)2�L,-��c�7�L��H-I�0���љ+F��� ��*�      S     x�u�MO�0Eׯ�b�&�~<h�,F��&�;6��N0���ʗL�69��צ��i��d���||{��Ƹ��m��d���Y�]w�8[No��MxhQp��oè_Y�b�Qt(��^�J��ڦ���d����_(@Dp��Ɗ����n�k~��K�Q��RD\�yBnF�0Nd�j�Q�+�Z�9k�/���i�����u�6����;2"�L=�j6�$.&a�i֦W4ΠU	R�ݫZ��W�1�7�L%AѨA�������t��#Ų[���J�@     