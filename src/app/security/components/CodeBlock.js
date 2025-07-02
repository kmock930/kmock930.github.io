import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const CodeBlock = ({ code, language = 'javascript', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {title && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          padding: 2,
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '400px',
          '& .keyword': { color: '#569cd6' },
          '& .string': { color: '#ce9178' },
          '& .comment': { color: '#6a9955' },
          '& .function': { color: '#dcdcaa' },
        }}
      >
        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
          <IconButton
            onClick={handleCopy}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            size="small"
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', paddingRight: '40px' }}>
          <code>{code}</code>
        </pre>
      </Box>
    </Box>
  );
};

export default CodeBlock;