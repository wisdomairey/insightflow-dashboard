# InsightFlow - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

InsightFlow is a professional executive dashboard analytics platform built with Next.js 14, TypeScript, and Tailwind CSS. This is a portfolio project showcasing enterprise-grade frontend development capabilities.

## Core Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Drag & Drop**: react-grid-layout for customizable widgets
- **State Management**: React hooks with optimized performance
- **Icons**: Lucide React for consistent iconography

## Architecture Guidelines

- Use Server Components by default, Client Components only when needed
- Implement proper error boundaries and loading states
- Follow atomic design principles (atoms, molecules, organisms)
- Use TypeScript interfaces for all data structures
- Implement proper SEO with Next.js metadata API

## Performance Standards

- Implement React.memo for expensive components
- Use useMemo and useCallback for optimization
- Lazy load components and data when appropriate
- Implement virtual scrolling for large datasets
- Optimize images with Next.js Image component

## Accessibility Requirements

- All components must be WCAG 2.1 AA compliant
- Implement proper ARIA labels and roles
- Ensure keyboard navigation support
- Use semantic HTML elements
- Provide alternative text for visual content

## Code Style

- Use functional components with hooks
- Implement custom hooks for reusable logic
- Use TypeScript strict mode
- Follow consistent naming conventions (camelCase, PascalCase)
- Add JSDoc comments for complex functions

## Folder Structure

- `/src/components` - Reusable UI components
- `/src/app` - Next.js 14 app router pages
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/src/data` - Mock data and API functions
- `/src/hooks` - Custom React hooks
- `/src/styles` - Global styles and Tailwind config

## Component Guidelines

- Always include TypeScript interfaces for props
- Implement loading and error states
- Use compound component patterns for complex UI
- Export components with proper JSDoc comments
- Include unit tests for critical components

## Data Visualization

- Use Recharts for all chart components
- Implement responsive chart designs
- Add proper color schemes for accessibility
- Include chart legends and tooltips
- Support data export functionality

## Theme System

- Support light/dark mode toggle
- Use CSS custom properties for theme values
- Implement consistent color palettes
- Support brand customization options
- Follow design system principles
