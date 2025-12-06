// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook para gestionar autenticación de usuarios
 * @returns {Object} Estados y funciones de autenticación
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar sesión actual al montar
    useEffect(() => {
        checkSession();

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Verificar sesión actual
     */
    const checkSession = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            setSession(session);
            setUser(session?.user ?? null);
        } catch (err) {
            console.error('Error checking session:', err);
            setError(err.message);
            setUser(null);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login con email y password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Resultado del login
     */
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            setSession(data.session);
            setUser(data.user);

            return { success: true, user: data.user };
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            setLoading(true);
            setError(null);

            const { error: logoutError } = await supabase.auth.signOut();

            if (logoutError) throw logoutError;

            setUser(null);
            setSession(null);

            return { success: true };
        } catch (err) {
            console.error('Logout error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Signup con email y password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    const signup = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signupError) throw signupError;

            return { success: true, user: data.user };
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Recuperar contraseña
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    const resetPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (resetError) throw resetError;

            return { success: true };
        } catch (err) {
            console.error('Reset password error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar contraseña
     * @param {string} newPassword 
     * @returns {Promise<Object>}
     */
    const updatePassword = async (newPassword) => {
        try {
            setLoading(true);
            setError(null);

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            return { success: true };
        } catch (err) {
            console.error('Update password error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        session,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        resetPassword,
        updatePassword,
        checkSession,
    };
}
