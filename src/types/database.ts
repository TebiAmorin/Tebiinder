export type Rol =
  | "entry-fragger"
  | "flex"
  | "support"
  | "anchor"
  | "roamer"
  | "hard-breach"
  | "intel";

export type Region = "eu-west" | "eu-east" | "na" | "latam" | "apac";

export type Plataforma = "pc" | "playstation" | "xbox";

export type Disponibilidad =
  | "diaria"
  | "fines-de-semana"
  | "flexible"
  | "solo-competitivo";

export type UserRole = "invitado" | "ojeador" | "jugador" | "capitan";

export interface Database {
  public: {
    Tables: {
      jugadores: {
        Row: {
          id: string;
          user_id: string;
          discord_id: string;
          discord_username: string;
          discord_avatar: string | null;
          ubisoft_id: string | null;
          rango: string | null;
          kd: number | null;
          top_atacante: string | null;
          top_defensor: string | null;
          rank_image_url: string | null;
          rank_color: string | null;
          rol_principal: Rol;
          rol_secundario: Rol | null;
          disponibilidad: Disponibilidad;
          region: Region;
          idioma: string;
          plataforma: Plataforma;
          destacado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          discord_id: string;
          discord_username: string;
          discord_avatar?: string | null;
          ubisoft_id?: string | null;
          rango?: string | null;
          kd?: number | null;
          top_atacante?: string | null;
          top_defensor?: string | null;
          rank_image_url?: string | null;
          rank_color?: string | null;
          rol_principal: Rol;
          rol_secundario?: Rol | null;
          disponibilidad: Disponibilidad;
          region: Region;
          idioma: string;
          plataforma: Plataforma;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          discord_id?: string;
          discord_username?: string;
          discord_avatar?: string | null;
          ubisoft_id?: string | null;
          rango?: string | null;
          kd?: number | null;
          top_atacante?: string | null;
          top_defensor?: string | null;
          rank_image_url?: string | null;
          rank_color?: string | null;
          rol_principal?: Rol;
          rol_secundario?: Rol | null;
          disponibilidad?: Disponibilidad;
          region?: Region;
          idioma?: string;
          plataforma?: Plataforma;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipos: {
        Row: {
          id: string;
          capitan_id: string;
          nombre_equipo: string;
          discord_id_capitan: string;
          discord_username_capitan: string;
          discord_avatar_capitan: string | null;
          descripcion: string | null;
          region: Region;
          idioma: string;
          plataforma: Plataforma;
          rol_buscado: Rol;
          rango_medio: string | null;
          kd_medio: number | null;
          integrantes_ubisoft_ids: string[] | null;
          destacado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          capitan_id: string;
          nombre_equipo: string;
          discord_id_capitan: string;
          discord_username_capitan: string;
          discord_avatar_capitan?: string | null;
          descripcion?: string | null;
          region: Region;
          idioma: string;
          plataforma: Plataforma;
          rol_buscado: Rol;
          rango_medio?: string | null;
          kd_medio?: number | null;
          integrantes_ubisoft_ids?: string[] | null;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          capitan_id?: string;
          nombre_equipo?: string;
          discord_id_capitan?: string;
          discord_username_capitan?: string;
          discord_avatar_capitan?: string | null;
          descripcion?: string | null;
          region?: Region;
          idioma?: string;
          plataforma?: Plataforma;
          rol_buscado?: Rol;
          rango_medio?: string | null;
          kd_medio?: number | null;
          integrantes_ubisoft_ids?: string[] | null;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      perfiles_usuario: {
        Row: {
          id: string;
          user_id: string;
          discord_id: string;
          discord_username: string;
          discord_avatar: string | null;
          rol: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          discord_id: string;
          discord_username: string;
          discord_avatar?: string | null;
          rol?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          discord_id?: string;
          discord_username?: string;
          discord_avatar?: string | null;
          rol?: UserRole;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
