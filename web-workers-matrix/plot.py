import matplotlib.pyplot as plt

# Data
matrix_dims = [500, 1000, 1500, 2000]

# Speedup values for each number of workers
speedup_2_workers = [2.101580042, 2.470469469, 2.611996927, 2.617401421]
speedup_4_workers = [3.551127083, 4.440583304, 4.616659682, 1.677222198]
speedup_8_workers = [3.668671367, 5.350719927, 6.394966862, 6.166259056]
speedup_16_workers = [2.067655671, 4.718401942, 5.554502742, 6.41585147]

# Create the figure and axis
fig, ax = plt.subplots(figsize=(8, 6))

# Plot the lines
ax.plot(matrix_dims, speedup_2_workers, marker='o', color='blue', label='2 workers')
ax.plot(matrix_dims, speedup_4_workers, marker='o', color='red', label='4 workers')
ax.plot(matrix_dims, speedup_8_workers, marker='o', color='green', label='8 workers')
ax.plot(matrix_dims, speedup_16_workers, marker='o', color='purple', label='16 workers')

# Add labels and title
ax.set_xlabel('Matrix Dimension')
ax.set_ylabel('Speedup')
ax.set_title('Speedup vs. Matrix Dimension for Different Number of Workers')

# Add grid and legend
ax.grid(True)
ax.legend()

# Show the plot
plt.tight_layout()
plt.show()
