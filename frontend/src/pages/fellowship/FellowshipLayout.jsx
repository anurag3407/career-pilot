import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { fellowshipApi } from '../../services/api'
import logger from '../../../utils/logger';
import {
    Briefcase,
    FileText,
    FolderKanban,
    PlusCircle,
    Home,
    GraduationCap,
    Building2,
    ShieldCheck,
    Sparkles,
    Menu,
    X,
    LogOut,
    MessageCircle
} from 'lucide-react'
import { SkeletonPage } from '../../components/ui/Skeleton'

const NAV_ITEMS = [
    { title: 'Browse Challenges', href: '/fellowship/challenges', icon: Briefcase, roles: ['student'] },
    { title: 'My Proposals', href: '/fellowship/my-proposals', icon: FileText, roles: ['student'] },
    { title: 'My Challenges', href: '/fellowship/my-challenges', icon: FolderKanban, roles: ['corporate'] },
    { title: 'Post Challenge', href: '/fellowship/create-challenge', icon: PlusCircle, roles: ['corporate'] },
    { title: 'Messages', href: '/fellowship/messages', icon: MessageCircle, roles: ['student', 'corporate'] },
]

export default function FellowshipLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        loadProfile()
    }, [user])

    const loadProfile = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fellowshipApi.getProfile()
            setProfile(response.data)

            if (!response.data?.role && !location.pathname.includes('/onboarding')) {
                navigate('/fellowship/onboarding')
            } else if (response.data?.role === 'corporate' &&
                (location.pathname === '/fellowship' || location.pathname === '/fellowship/challenges')) {
                navigate('/fellowship/my-challenges')
            }
        } catch (error) {
            logger.error('Error loading profile:', error);
            setError('Failed to load fellowship profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    if (loading) {
        return <SkeletonPage />
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="max-w-md text-center space-y-4">
                    <p className="text-foreground">{error}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={loadProfile}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-lg"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const filteredNavItems = NAV_ITEMS.filter(item =>
        !profile?.role || item.roles.includes(profile.role)
    )

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border px-6">
                <NavLink to="/fellowship/challenges" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                        <Briefcase className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground leading-tight">Fellowships</span>
                        <span className="text-[10px] text-muted-foreground">by careerpilot</span>
                    </div>
                </NavLink>
            </div>

            {profile?.role && (
                <div className="border-b border-border px-4 py-3">
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${profile.role === 'corporate'
                        ? 'bg-blue-950 text-blue-300'
                        : 'bg-emerald-950 text-emerald-300'
                        }`}>
                        {profile.role === 'corporate' ? (
                            <><Building2 className="h-4 w-4" /> Corporate Account</>
                        ) : (
                            <><GraduationCap className="h-4 w-4" /> Student Account</>
                        )}
                    </div>

                    {profile.role === 'student' && !profile.isVerified && (
                        <NavLink to="/fellowship/verify" onClick={() => setSidebarOpen(false)}>
                            <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-950 px-3 py-2 text-sm text-amber-300 cursor-pointer hover:bg-amber-900 transition-colors">
                                <ShieldCheck className="h-4 w-4" />
                                Verify to Apply →
                            </div>
                        </NavLink>
                    )}
                </div>
            )}

            <nav className="flex-1 space-y-1 p-4">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? 'bg-emerald-600 text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </NavLink>
                ))}

                <div className="my-4 border-t border-border" />

                <NavLink
                    to="/dashboard"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <Sparkles className="h-5 w-5" />
                    Back to Dashboard
                </NavLink>
            </nav>

            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-foreground font-medium">
                        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-foreground">{user?.displayName || 'User'}</p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden w-64 border-r border-border bg-background lg:block">
                <SidebarContent />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-background/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-background">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg font-semibold text-foreground lg:hidden">Fellowships</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet context={{ profile, refreshProfile: loadProfile }} />
                </main>
            </div>
        </div>
    )
}
