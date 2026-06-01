'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Car,
  Menu,
  X,
  User,
  LogOut,
  MapPin,
  LayoutDashboard,
  ChevronDown,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVendor = user?.role === 'VENDOR';

  const navLinks = isVendor
    ? [
        { href: '/vendor', label: 'Dashboard' },
        { href: '/vendor/vehicles', label: 'Kendaraan Saya' },
        { href: '/vendor/bookings', label: 'Booking Masuk' },
      ]
    : [
        { href: '/destinations', label: 'Destinasi' },
        { href: '/vehicles', label: 'Kendaraan' },
      ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-600">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Travelink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 mt-1">
                      {user?.role}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={isVendor ? '/vendor' : '/dashboard'} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isVendor ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/vendor/vehicles" className="flex items-center">
                          <Car className="mr-2 h-4 w-4" />
                          Kendaraan Saya
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/vendor/bookings" className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Booking Masuk
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/vendor/profile" className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4" />
                          Profil Vendor
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Booking Saya
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-gray-600 hover:text-blue-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-3 mt-2">
                {isAuth ? (
                  <>
                    <Link
                      href={isVendor ? '/vendor' : '/dashboard'}
                      className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isVendor ? (
                      <>
                        <Link
                          href="/vendor/vehicles"
                          className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 block"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Kendaraan Saya
                        </Link>
                        <Link
                          href="/vendor/bookings"
                          className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 block"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Booking Masuk
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/bookings"
                        className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Booking Saya
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-base font-medium text-red-600 hover:text-red-700 py-2 w-full text-left"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      className="text-base font-medium text-blue-600 hover:text-blue-700 py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
