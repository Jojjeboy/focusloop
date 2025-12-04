import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * AppDialog - Reusable dialog component with consistent styling
 */

interface AppDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    showCloseButton?: boolean;
    sx?: SxProps<Theme>;
}

export const AppDialog: React.FC<AppDialogProps> = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    showCloseButton = true,
    sx,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    ...sx,
                },
            }}
        >
            {title && (
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1,
                    }}
                >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                    {showCloseButton && (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'text.primary',
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </DialogTitle>
            )}
            <DialogContent dividers sx={{ py: 3 }}>
                {children}
            </DialogContent>
            {actions && (
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default AppDialog;
